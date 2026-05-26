<?php

namespace App\Services;

use App\Models\DailySaving;
use App\Models\Saving;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use InvalidArgumentException;

class DailySavingService
{
    protected $maxRetries = 3;

    public function __construct(private WalletService $walletService) {}

    public function processAutomaticContributions()
    {
        $today = Carbon::today();

        // Fetch automatic daily savings that are pending or failed, for non-cancelled savings
        $dailySavings = DailySaving::where('type', 'automatic')
            ->whereIn('status', ['pending', 'failed'])
            ->whereDate('expected_payment_at', '<=', $today)
            ->whereHas('savings', function ($query) {
                $query->where('status', '!=', 'cancelled');
            })
            ->whereNull('cancelled_at')
            ->get();

        foreach ($dailySavings as $contribution) {
            $this->processContribution($contribution);
        }
    }

    public function processContribution(DailySaving $contribution)
    {
        return DB::transaction(function () use ($contribution) {
            $contribution = DailySaving::whereKey($contribution->id)->lockForUpdate()->firstOrFail();

            if ($contribution->status === 'successful' || $contribution->status === 'cancelled') {
                return $contribution;
            }

            if ($contribution->status === 'failed' && $contribution->retry_count >= $this->maxRetries) {
                $contribution->update([
                    'failure_reason' => 'Maximum retry attempts reached',
                ]);
                return $contribution;
            }

            $user = $contribution->user()->lockForUpdate()->firstOrFail();

            if ($user->wallet < $contribution->amount) {
                $contribution->update([
                    'status' => 'failed',
                    'retry_count' => $contribution->retry_count + 1,
                    'failure_reason' => 'insufficient_fund',
                ]);
                return $contribution;
            }

            if (!$contribution->transaction_reference) {
                $contribution->transaction_reference = (string) Str::uuid();
                $contribution->save();
            }

            $transaction = Transaction::firstOrCreate(
                ['reference' => (string) $contribution->transaction_reference],
                [
                    'user_id' => $user->id,
                    'type' => 'saving',
                    'amount' => $contribution->amount,
                    'method' => 'wallet',
                    'status' => 'pending',
                    'note' => 'Daily savings contribution for Saving ID: ' . $contribution->saving_id,
                ]
            );

            try {
                $this->walletService->debit(
                    $user,
                    $contribution->amount,
                    'savings_contribution',
                    'daily-saving:' . $contribution->id,
                    $transaction,
                    [
                        'saving_id' => $contribution->saving_id,
                        'daily_saving_id' => $contribution->id,
                    ]
                );
            } catch (InvalidArgumentException $e) {
                if ($e->getMessage() !== 'Insufficient wallet balance.') {
                    throw $e;
                }

                $contribution->update([
                    'status' => 'failed',
                    'retry_count' => $contribution->retry_count + 1,
                    'failure_reason' => 'insufficient_fund',
                ]);

                $transaction->update([
                    'status' => 'canceled',
                    'note' => 'Daily savings contribution failed: insufficient wallet balance.',
                ]);

                return $contribution;
            }

            $transaction->update([
                'status' => 'approved',
                'approved_by' => $contribution->processed_by,
                'approved_at' => now(),
                'confirmed_by' => $contribution->processed_by,
                'confirmed_at' => now(),
                'paid_at' => now(),
            ]);

            $user->refresh();
            $user->savings_balance = (float) $user->savings_balance + (float) $contribution->amount;
            $user->save();

            $contribution->update([
                'status' => 'successful',
                'paid_at' => Carbon::now(),
                'retry_count' => $contribution->retry_count,
                'failure_reason' => null,
                'processed_by' => null,
            ]);

            // Update saving status
            $this->updateSavingStatus($contribution->savings);

            return $contribution;
        });
    }

    public function processManualContribution(Saving $saving, User $user, ?User $processedBy)
    {
        if ($user->id !== $saving->user_id && !$this->isMarketerForUser($processedBy, $saving->user_id)) {
            throw new \Exception('Unauthorized to process this contribution');
        }

        $today = Carbon::today();
        $contribution = DailySaving::where('saving_id', $saving->id)
            ->whereDate('expected_payment_at', $today)
            ->whereIn('status', ['pending', 'failed'])
            ->where('type', 'manual')
            ->whereNull('cancelled_at')
            ->first();

        if (!$contribution) {
            throw new \Exception('No manual contribution available for today');
        }

        $contribution->processed_by = $processedBy->id;
        return $this->processContribution($contribution);
    }

    protected function updateSavingStatus(Saving $saving)
    {
        $allSuccessful = $saving->dailySavings()
            ->whereIn('status', ['pending', 'failed'])
            ->whereNull('cancelled_at')
            ->doesntExist();
        if ($allSuccessful) {
            $saving->update(['status' => 'completed']);
        } elseif ($saving->status === 'pending' && $saving->dailySavings()->where('status', 'successful')->exists()) {
            $saving->update(['status' => 'started']);
        }
    }

    protected function isMarketerForUser(User $marketer, $userId)
    {
        return $marketer->hasRole('marketer'); // Adjust based on your role system
    }
}
