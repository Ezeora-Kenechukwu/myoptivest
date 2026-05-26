<?php

namespace App\Http\Controllers;

use App\Models\Investment;
use App\Models\InvestmentPlan;
use App\Models\ManualPaymentMethod;
use App\Models\Transaction;
use App\Services\WalletService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class InvestmentController extends Controller
{
    public function __construct(private WalletService $walletService) {}

    public function index()
    {
        $user = auth()->user();


if ($user->type == 'admin') {
            $investments = Investment::with('plan', 'user','approver','rejector')
                ->latest()
                ->get();
                return Inertia::render('Investments/Index', [
                    'investments' => $investments,

                ]);
        }else {
            $investments = Investment::with('plan', 'user', 'approver','rejector')
                ->where('user_id', $user->id)
                ->latest()
                ->get();
                return Inertia::render('Investments/UserInvestments', [
                    'investments' => $investments,

                ]);
        }

    }
    public function create()
    {

        return Inertia::render('Investments/Create', [
            'plans' => InvestmentPlan::where('active', true)->with(['category'])->get(),
            'manual_payment_methods' => ManualPaymentMethod::where('active', true)->get(),
        ]);
    }

   public function store(Request $request)
{
    $request->validate([
        'plan_id' => ['required', 'exists:investment_plans,id'],
        'amount' => ['required', 'numeric', 'min:1'],
    ]);

    $user = auth()->user();
    $plan = InvestmentPlan::findOrFail($request->plan_id);
    $amount = round((float) $request->amount, 2);

    if ($amount < $plan->min_amount || ($plan->max_amount && $amount > $plan->max_amount)) {
        return back()->withErrors(['amount' => 'Amount is outside the allowed range for this plan.']);
    }

    if ($amount > $user->wallet) {
        return back()->withErrors(['amount' => 'Insufficient wallet balance.']);
    }

    // Determine payout interval in hours
    $periodHours = match ($plan->payout_frequency) {
        'daily' => 24,
        'weekly' => 24 * 7,
        'monthly' => 24 * 30,
        'yearly' => 24 * 365,
    };

    $numberOfPeriods = floor(($plan->duration * 30 * 24) / $periodHours);
    $roiDecimal = $plan->roi / 100;
    $totalExpectedProfit = $amount * $roiDecimal;

    try {
        DB::transaction(function () use ($user, $plan, $amount, $numberOfPeriods, $periodHours, $totalExpectedProfit) {
            $investment = Investment::create([
                'user_id' => $user->id,
                'investment_plan_id' => $plan->id,
                'invest_amount' => $amount,
                'roi' => $plan->roi,
                'number_of_periods' => max(1, $numberOfPeriods),
                'period_hours' => $periodHours,
                'payout_frequency' => $plan->payout_frequency,
                'total_expected_profit' => $totalExpectedProfit,
                'capital_back' => true,
                'status' => 'pending',
            ]);

            $transaction = Transaction::create([
                'user_id' => $user->id,
                'type' => 'investment',
                'method' => 'wallet',
                'amount' => $amount,
                'status' => 'approved',
                'note' => 'Investment funded from wallet.',
                'approved_by' => auth()->id(),
                'approved_at' => now(),
                'confirmed_by' => auth()->id(),
                'confirmed_at' => now(),
                'paid_at' => now(),
                'reference' => 'INV-' . Str::uuid(),
            ]);

            $this->walletService->debit(
                $user,
                $amount,
                'investment_purchase',
                'investment:' . $investment->id,
                $transaction,
                [
                    'investment_id' => $investment->id,
                    'investment_plan_id' => $plan->id,
                ]
            );

            DB::table('users')
                ->where('id', $user->id)
                ->increment('investment_balance', $amount);
        });

        return redirect()->route('investments.index')->with('success', 'Investment submitted successfully and wallet debited.');

    } catch (\Throwable $e) {
        return back()->withErrors(['error' => 'An error occurred: ' . $e->getMessage()]);
    }
}


    public function approve(Investment $investment)
    {
        abort_unless(auth()->user()?->type === 'admin', 403);

        $investment->update([
            'status' => 'approved',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
            'last_profit_at' => now(),
            'next_profit_at' => now()->addHours($investment->period_hours),
        ]);

        event(new \App\Events\ReferralBonusTriggered(
            'investment',
            $investment->user,
            $investment->invest_amount,
            \App\Models\Investment::class,
            $investment->id
        ));

        return back()->with('success', 'Investment approved.');
    }

    public function reject(Request $request, Investment $investment)
    {
        abort_unless(auth()->user()?->type === 'admin', 403);

        $request->validate([
            'reason' => ['nullable', 'string', 'max:1000'],
        ]);

        DB::transaction(function () use ($investment, $request) {
            $investment = Investment::whereKey($investment->id)->lockForUpdate()->firstOrFail();

            if ($investment->status === 'rejected') {
                return;
            }

            $transaction = Transaction::create([
                'user_id' => $investment->user_id,
                'type' => 'investment',
                'method' => 'wallet',
                'amount' => $investment->invest_amount,
                'status' => 'approved',
                'note' => $request->input('reason', 'Investment rejected and wallet refunded.'),
                'approved_by' => auth()->id(),
                'approved_at' => now(),
                'confirmed_by' => auth()->id(),
                'confirmed_at' => now(),
                'paid_at' => now(),
                'reference' => 'INV-REFUND-' . Str::uuid(),
            ]);

            $user = $investment->user()->lockForUpdate()->firstOrFail();

            $this->walletService->credit(
                $user,
                $investment->invest_amount,
                'investment_refund',
                'investment-refund:' . $investment->id,
                $transaction,
                ['investment_id' => $investment->id]
            );

            $user->refresh();
            $user->investment_balance = max(0, (float) $user->investment_balance - (float) $investment->invest_amount);
            $user->save();

            $investment->update([
                'status' => 'rejected',
                'rejected_by' => auth()->id(),
                'rejected_at' => now(),
            ]);
        });

        return back()->with('success', 'Investment rejected.');
    }

    public function show(Investment $investment)
    {
        abort_unless(auth()->user()?->type === 'admin' || (int) $investment->user_id === (int) auth()->id(), 403);
        $investment->load('user', 'plan');

        return Inertia::render('Investments/Show', [
            'investment' => $investment
        ]);
    }

    public function edit(Investment $investment)
    {
        if ($investment->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Investments/Edit', [
            'investment' => $investment
        ]);
    }

    public function update(Request $request, Investment $investment)
    {
        if ($investment->user_id !== auth()->id() || $investment->status === 'approved') {
            abort(403);
        }

        $request->validate([
            'amount' => 'required|numeric|min:1',
        ]);

        $plan = $investment->plan;

        if ($request->amount < $plan->min_amount || ($plan->max_amount && $request->amount > $plan->max_amount)) {
            return back()->withErrors(['amount' => 'Amount is outside plan limits.']);
        }

        $roiDecimal = $plan->roi / 100;
        $totalExpectedProfit = $request->amount * $roiDecimal;

        $investment->update([
            'invest_amount' => $request->amount,
            'total_expected_profit' => $totalExpectedProfit,
        ]);

        return redirect()->route('investments.index')->with('success', 'Investment updated.');
    }
}
