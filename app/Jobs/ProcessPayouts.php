<?php

namespace App\Jobs;

use App\Models\Payout;
use App\Models\Transaction;
use App\Notifications\PayoutProcessedNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class ProcessPayouts implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle()
    {
        $now = Carbon::now();
        $payouts = Payout::where('status', 'pending')
            ->where('expected_payment_at', '<=', $now)
            ->where('retry_count', '<', 3)
            ->with(['investment', 'user'])
            ->get();

        foreach ($payouts as $payout) {
            DB::beginTransaction();
            try {
                $user = $payout->user;
                $investment = $payout->investment;

                $payoutAmount = $payout->amount;
                $user->update([
                    'investment_balance' => $user->investment_balance - $payout->amount,
                    'withdrawable_investment_balance' => $user->has_active_loan
                        ? $user->withdrawable_investment_balance
                        : $user->withdrawable_investment_balance + $payoutAmount,
                ]);

                Transaction::create([
                    'user_id' => $user->id,
                    'type' => 'investment_payout',
                    'amount' => $payoutAmount,
                    'method' => 'payout',
                    'status' => 'completed',
                    'note' => "Payout #{$payout->payout_index} for investment #{$investment->id}",
                    'approved_by' => 1,
                    'approved_at' => $now,
                    'confirmed_by' => 1,
                    'confirmed_at' => $now,
                    'paid_at' => $now,
                ]);

                $payout->update([
                    'status' => 'completed',
                    'paid_at' => $now,
                    'retry_count' => 0,
                    'last_retry_at' => null,
                ]);

                $completedPayouts = $investment->payouts()->where('status', 'completed')->count();
                if ($completedPayouts >= $investment->total_payouts) {
                    $investment->update(['status' => 'completed']);
                }

                $user->notify(new PayoutProcessedNotification($payout));

                DB::commit();
                Log::info("Processed payout #{$payout->id} for investment #{$investment->id}");
            } catch (\Throwable $e) {
                DB::rollBack();
                $payout->update([
                    'retry_count' => $payout->retry_count + 1,
                    'last_retry_at' => $now,
                    'status' => $payout->retry_count + 1 >= 3 ? 'failed' : 'pending',
                ]);
                Log::error("Failed to process payout #{$payout->id}: {$e->getMessage()}", [
                    'investment_id' => $payout->investment_id,
                    'user_id' => $payout->user_id,
                    'stack' => $e->getTraceAsString(),
                ]);
            }
        }
    }
}
