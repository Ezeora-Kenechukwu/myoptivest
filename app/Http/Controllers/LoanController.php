<?php

namespace App\Http\Controllers;

use App\Jobs\SendLoanNotification;
use App\Models\Investment;
use App\Models\Loan;
use App\Models\LoanPlan;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class LoanController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = auth()->user();
            


            $activeInvestments = Investment::where('user_id', $user->id)
                ->where('status', 'approved')
                ->select(['id', 'invest_amount', 'total_expected_profit'])
                ->get();

            $isEligible = $activeInvestments->isNotEmpty();
            $maxLoanAmount = 0;
            $loanPlans = [];

            if ($isEligible) {
                $totalReturns = $activeInvestments->sum(fn($inv) => $inv->invest_amount + $inv->total_expected_profit);
                $maxLoanAmount = round($totalReturns * 0.8, 2); // 80% of total returns
                $loanPlans = Cache::remember('active_loan_plans', 3600, fn() =>
                    LoanPlan::where('active', true)
                        ->select(['id', 'name', 'min_amount', 'max_amount', 'interest_rate', 'duration', 'min_profit_balance'])
                        ->get()
                );
            }

            $loans = Loan::where('user_id', $user->id)
                ->select(['id', 'loan_plan_id', 'amount', 'total_repayment', 'status', 'approved_at', 'rejected_at', 'disbursed_at', 'created_at'])
                ->with(['loanPlan' => fn($query) => $query->select('id', 'name', 'interest_rate', 'duration')])
                ->latest()
                ->paginate(10);

            return Inertia::render('Loans/Index', [
                'isEligible' => $isEligible,
                'maxLoanAmount' => $maxLoanAmount,
                'loanPlans' => $loanPlans,
                'loans' => $loans,

            ]);
        } catch (\Throwable $e) {
            Log::error('Failed to load loans page', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
            ]);
            return back()->withErrors(['error' => 'An error occurred while loading the loans page.']);
        }
    }

    public function store(Request $request)
    {
        try {
            $user = auth()->user();
            $activeInvestments = Investment::where('user_id', $user->id)
                ->where('status', 'approved')
                ->select(['id', 'invest_amount', 'total_expected_profit'])
                ->get();

            if ($activeInvestments->isEmpty()) {
                return back()->withErrors(['error' => 'You are not eligible for a loan. Please have an active investment.']);
            }

            $validated = $request->validate([
                'loan_plan_id' => ['required', 'exists:loan_plans,id'],
                'amount' => ['required', 'numeric', 'min:1'],
            ]);

            $loanPlan = Cache::remember("loan_plan_{$validated['loan_plan_id']}", 3600, fn() =>
                LoanPlan::select(['id', 'min_amount', 'max_amount', 'interest_rate', 'duration', 'min_profit_balance'])
                    ->findOrFail($validated['loan_plan_id'])
            );

            $totalReturns = $activeInvestments->sum(fn($inv) => $inv->invest_amount + $inv->total_expected_profit);
            $maxLoanAmount = round($totalReturns * 0.8, 2);

            if ($validated['amount'] < $loanPlan->min_amount || $validated['amount'] > $loanPlan->max_amount) {
                return back()->withErrors(['amount' => 'Loan amount is outside the allowed range for this plan.']);
            }

            if ($validated['amount'] > $maxLoanAmount) {
                return back()->withErrors(['amount' => 'Loan amount exceeds the maximum allowed based on your investment returns.']);
            }

            if ($user->investment_profit_balance < $loanPlan->min_profit_balance) {
                return back()->withErrors(['error' => 'Insufficient investment profit balance for this loan plan.']);
            }

            if ($user->has_active_loan) {
                return back()->withErrors(['error' => 'You already have an active loan.']);
            }

            $totalRepayment = $validated['amount'] * (1 + ($loanPlan->interest_rate / 100));

            DB::beginTransaction();

            $loan = Loan::create([
                'user_id' => $user->id,
                'loan_plan_id' => $loanPlan->id,
                'amount' => $validated['amount'],
                'interest_rate' => $loanPlan->interest_rate,
                'duration' => $loanPlan->duration,
                'total_repayment' => round($totalRepayment, 2),
                'status' => 'pending',
            ]);

            SendLoanNotification::dispatch($loan, 'requested');
            SendLoanNotification::dispatch($loan, 'requested', true);

            DB::commit();

            return redirect()->route('loans.index')->with('success', 'Loan request submitted successfully.');
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Failed to request loan', [
                'user_id' => auth()->id(),
                'request_data' => $request->all(),
                'error' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
            ]);
            return back()->withErrors(['error' => 'An error occurred while submitting the loan request.']);
        }
    }

    public function approve(Loan $loan)
    {
        try {
            if ($loan->status !== 'pending') {
                return back()->withErrors(['error' => 'Loan is not in a pending state.']);
            }

            DB::beginTransaction();
            $loan->update([
                'status' => 'approved',
                'approved_by' => auth()->id(),
                'approved_at' => now(),
            ]);

            SendLoanNotification::dispatch($loan, 'approved');
            SendLoanNotification::dispatch($loan, 'approved', true);

            DB::commit();
            return back()->with('success', 'Loan approved successfully.');
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Failed to approve loan', [
                'loan_id' => $loan->id,
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
            ]);
            return back()->withErrors(['error' => 'Failed to approve loan: ' . $e->getMessage()]);
        }
    }

    public function reject(Loan $loan)
    {
        try {
            if ($loan->status !== 'pending') {
                return back()->withErrors(['error' => 'Loan is not in a pending state.']);
            }

            DB::beginTransaction();
            $loan->update([
                'status' => 'rejected',
                'rejected_by' => auth()->id(),
                'rejected_at' => now(),
            ]);

            SendLoanNotification::dispatch($loan, 'rejected');
            SendLoanNotification::dispatch($loan, 'rejected', true);

            DB::commit();
            return back()->with('success', 'Loan rejected successfully.');
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Failed to reject loan', [
                'loan_id' => $loan->id,
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
            ]);
            return back()->withErrors(['error' => 'Failed to reject loan.']);
        }
    }

    public function disburse(Loan $loan)
    {
        try {
            if ($loan->status !== 'approved') {
                return back()->withErrors(['error' => 'Loan must be approved before disbursement.']);
            }

            DB::beginTransaction();
            $loan->update([
                'status' => 'disbursed',
                'disbursed_at' => now(),
            ]);

            $user = $loan->user;
            $user->update(['wallet' => $user->wallet + $loan->amount]);

            Transaction::create([
                'user_id' => $user->id,
                'type' => 'loan_disbursement',
                'amount' => $loan->amount,
                'method' => 'wallet',
                'status' => 'completed',
                'note' => "Loan disbursement for Loan ID: {$loan->id}",
                'approved_by' => auth()->id(),
                'approved_at' => now(),
                'reference' => 'LOAN-' . \Illuminate\Support\Str::uuid(),
            ]);

            $loan->createRepaymentSchedule();

            SendLoanNotification::dispatch($loan, 'disbursed');
            SendLoanNotification::dispatch($loan, 'disbursed', true);

            DB::commit();
            return back()->with('success', 'Loan disbursed successfully.');
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Failed to disburse loan', [
                'loan_id' => $loan->id,
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
            ]);
            return back()->withErrors(['error' => 'Failed to disburse loan: ' . $e->getMessage()]);
        }
    }

    public function cancel(Loan $loan)
    {
        try {
            if ($loan->status !== 'pending') {
                return back()->withErrors(['error' => 'Only pending loans can be cancelled.']);
            }

            DB::beginTransaction();
            $loan->update([
                'status' => 'cancelled',
                'cancelled_at' => now(),
            ]);

            SendLoanNotification::dispatch($loan, 'cancelled');
            SendLoanNotification::dispatch($loan, 'cancelled', true);

            DB::commit();
            return back()->with('success', 'Loan cancelled successfully.');
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Failed to cancel loan', [
                'loan_id' => $loan->id,
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
            ]);
            return back()->withErrors(['error' => 'Failed to cancel loan.']);
        }
    }

    public function adminIndex()
    {
        try {
            $loans = Loan::select([
                'id', 'user_id', 'loan_plan_id', 'amount', 'total_repayment', 'status',
                'approved_by', 'approved_at', 'rejected_by', 'rejected_at', 'disbursed_at', 'created_at'
            ])
                ->with([
                    'user' => fn($query) => $query->select('id', 'name', 'email'),
                    'loanPlan' => fn($query) => $query->select('id', 'name', 'interest_rate', 'duration'),
                    'approver' => fn($query) => $query->select('id', 'name'),
                    'rejector' => fn($query) => $query->select('id', 'name'),
                ])
                ->latest()
                ->paginate(10);



            return Inertia::render('Loans/AdminIndex', [
                'loans' => $loans,

            ]);
        } catch (\Throwable $e) {
            Log::error('Failed to load admin loans page', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
            ]);
            return back()->withErrors(['error' => 'An error occurred while loading the loans page.']);
        }
    }
}
