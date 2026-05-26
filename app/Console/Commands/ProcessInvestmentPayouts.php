<?php

namespace App\Console\Commands;

use App\Models\Investment;
use App\Models\Transaction;
use App\Models\User;
use App\Services\WalletService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ProcessInvestmentPayouts extends Command
{
    protected $signature = 'investments:process-returns';
    protected $description = 'Process ROI returns for active investments';

    public function handle(WalletService $walletService): void
    {
        $now = Carbon::now();

        $investments = Investment::where('status', 'approved')
            ->whereNotNull('next_profit_at')
            ->where('next_profit_at', '<=', $now->copy()->addMinutes(10))
            ->get();

        foreach ($investments as $investment) {
            try {
                DB::transaction(function () use ($investment, $walletService, $now) {
                    $investment = Investment::whereKey($investment->id)->lockForUpdate()->firstOrFail();

                    if ($investment->status !== 'approved') {
                        return;
                    }

                    if ($investment->last_profit_at && $investment->next_profit_at <= $investment->last_profit_at) {
                        return;
                    }

                    $user = User::whereKey($investment->user_id)->lockForUpdate()->firstOrFail();
                    $periodCount = max(1, (int) $investment->number_of_periods);
                    $periodNumber = (int) $investment->profit_paid_count + 1;
                    $totalReturn = (float) $investment->invest_amount + (float) $investment->total_expected_profit;
                    $perPeriodReturn = round($totalReturn / $periodCount, 2);

                    $transaction = Transaction::create([
                        'user_id' => $user->id,
                        'type' => 'investment',
                        'amount' => $perPeriodReturn,
                        'method' => 'return on investment',
                        'status' => 'approved',
                        'note' => "ROI for investment #{$investment->id} (period {$periodNumber} of {$periodCount})",
                        'approved_by' => 1,
                        'approved_at' => $now,
                        'confirmed_by' => 1,
                        'confirmed_at' => $now,
                        'paid_at' => $now,
                        'reference' => 'ROI-' . Str::uuid(),
                    ]);

                    $walletService->credit(
                        $user,
                        $perPeriodReturn,
                        'investment_return',
                        "investment-return:{$investment->id}:{$periodNumber}",
                        $transaction,
                        [
                            'investment_id' => $investment->id,
                            'period' => $periodNumber,
                        ]
                    );

                    $user->refresh();
                    $user->investment_balance = max(0, (float) $user->investment_balance - $perPeriodReturn);
                    $user->withdrawable_investment_balance = (float) $user->withdrawable_investment_balance + $perPeriodReturn;
                    $user->save();

                    $investment->profit_paid_count = $periodNumber;
                    $investment->last_profit_at = $now;

                    if ($investment->profit_paid_count >= $periodCount) {
                        $investment->status = 'completed';
                        $investment->next_profit_at = null;
                    } else {
                        $investment->next_profit_at = $now->copy()->addHours($investment->period_hours);
                    }

                    $investment->save();
                });

                $this->info("Paid ROI for investment #{$investment->id}");
            } catch (\Throwable $e) {
                Log::error("Error processing investment #{$investment->id}: " . $e->getMessage());
                $this->error("Failed investment #{$investment->id}: " . $e->getMessage());
            }
        }
    }
}
