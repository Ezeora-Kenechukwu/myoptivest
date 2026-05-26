<?php

namespace App\Services;

use App\Mail\WalletFundedMail;
use App\Models\MonnifyTransaction;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class WalletFundingService
{
    public function __construct(private WalletService $walletService) {}

    public function confirmMonnifyPayment(string $reference, float|string $amount, ?Carbon $paidAt = null, array $providerPayload = [], string $status = 'PAID'): ?Transaction
    {
        $paidAt = $paidAt ?: now();
        $amount = round((float) $amount, 2);

        if ($amount <= 0) {
            Log::warning('Monnify payment ignored because amount is invalid.', compact('reference', 'amount'));
            return null;
        }

        $transaction = DB::transaction(function () use ($reference, $amount, $paidAt, $providerPayload, $status) {
            /** @var Transaction|null $transaction */
            $transaction = Transaction::where('reference', $reference)->lockForUpdate()->first();
            if (!$transaction) {
                return null;
            }

            $monnifyTransaction = MonnifyTransaction::where('reference', $reference)->lockForUpdate()->first();
            if ($monnifyTransaction) {
                $monnifyTransaction->update([
                    'status' => strtoupper($status),
                    'amount' => $amount,
                    'paid_at' => $paidAt,
                    'response' => json_encode($providerPayload),
                ]);
            }

            if (in_array($transaction->status, ['confirmed', 'approved'], true)) {
                return $transaction;
            }

            $transaction->update([
                'status' => 'confirmed',
                'amount' => $amount,
                'paid_at' => $paidAt,
                'confirmed_at' => now(),
            ]);

            /** @var User|null $user */
            $user = User::whereKey($transaction->user_id)->first();
            if ($user) {
                $this->walletService->credit(
                    $user,
                    $amount,
                    'wallet_funding',
                    'monnify:' . $reference,
                    $transaction,
                    [
                        'provider' => 'monnify',
                        'provider_reference' => $reference,
                        'status' => strtoupper($status),
                        'source' => $providerPayload['source'] ?? 'provider_confirmation',
                    ]
                );
            }

            return $transaction;
        });

        if ($transaction && $transaction->user) {
            try {
                Mail::to($transaction->user->email)->queue(new WalletFundedMail($transaction->user, $amount, $reference));
            } catch (\Throwable $e) {
                Log::warning("WalletFundedMail failed for {$reference}: " . $e->getMessage());
            }
        }

        return $transaction;
    }
}
