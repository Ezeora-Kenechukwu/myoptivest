<?php

namespace App\Jobs;

use App\Models\Investment;
use App\Models\Payout;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class CreatePayoutSchedule implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $investment;

    public function __construct(Investment $investment)
    {
        $this->investment = $investment;
    }

    public function handle()
    {
        DB::beginTransaction();
        try {
            $investment = $this->investment->fresh(['plan']);
            $plan = $investment->plan;
            $totalReturn = $investment->invest_amount + $investment->total_expected_profit;

            // Assume plan duration is in months
            $durationInMonths = $plan->duration;

            // Calculate number of periods based on payout frequency
            $numberOfPeriods = match ($investment->payout_frequency) {
                'daily' => $durationInMonths * 30, // Approximate days in a month
                'weekly' => ceil($durationInMonths * 4.333), // Approximate weeks in a month
                'monthly' => $durationInMonths,
                'yearly' => ceil($durationInMonths / 12),
                default => throw new \Exception("Invalid payout frequency: {$investment->payout_frequency}"),
            };

            $perPeriodAmount = $numberOfPeriods > 0 ? $totalReturn / $numberOfPeriods : $totalReturn;

            $investment->total_payouts = $numberOfPeriods;
            $investment->save();

            $startDate = Carbon::now();
            for ($i = 0; $i < $numberOfPeriods; $i++) {
                $expectedPaymentAt = match ($investment->payout_frequency) {
                    'daily' => $startDate->copy()->addDays($i),
                    'weekly' => $startDate->copy()->addWeeks($i),
                    'monthly' => $startDate->copy()->addMonths($i),
                    'yearly' => $startDate->copy()->addYears($i),
                };

                Payout::create([
                    'investment_id' => $investment->id,
                    'user_id' => $investment->user_id,
                    'amount' => round($perPeriodAmount, 2),
                    'payout_index' => $i + 1,
                    'status' => 'pending',
                    'expected_payment_at' => $expectedPaymentAt,
                ]);
            }

            DB::commit();
            Log::info("Payout schedule created for investment #{$investment->id}");
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Failed to create payout schedule for investment #{$this->investment->id}", [
                'error' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
            ]);
            throw $e; // Re-throw to allow queue retries or failure handling
        }
    }
}
