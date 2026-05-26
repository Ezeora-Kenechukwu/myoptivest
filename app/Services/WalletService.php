<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\User;
use App\Models\WalletLedger;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class WalletService
{
    public function credit(User $user, float|string $amount, string $reason, string $idempotencyKey, ?Transaction $transaction = null, array $metadata = []): WalletLedger
    {
        return $this->move($user, $amount, 'credit', $reason, $idempotencyKey, $transaction, $metadata);
    }

    public function debit(User $user, float|string $amount, string $reason, string $idempotencyKey, ?Transaction $transaction = null, array $metadata = []): WalletLedger
    {
        return $this->move($user, $amount, 'debit', $reason, $idempotencyKey, $transaction, $metadata);
    }

    private function move(User $user, float|string $amount, string $direction, string $reason, string $idempotencyKey, ?Transaction $transaction, array $metadata): WalletLedger
    {
        $amount = round((float) $amount, 2);

        if ($amount <= 0) {
            throw new InvalidArgumentException('Wallet amount must be greater than zero.');
        }

        return DB::transaction(function () use ($user, $amount, $direction, $reason, $idempotencyKey, $transaction, $metadata) {
            $existing = WalletLedger::where('idempotency_key', $idempotencyKey)->first();
            if ($existing) {
                return $existing;
            }

            /** @var User $lockedUser */
            $lockedUser = User::whereKey($user->getKey())->lockForUpdate()->firstOrFail();
            $before = (float) $lockedUser->wallet;
            $after = $direction === 'credit' ? $before + $amount : $before - $amount;

            if ($after < 0) {
                throw new InvalidArgumentException('Insufficient wallet balance.');
            }

            $lockedUser->wallet = $after;
            $lockedUser->save();

            return WalletLedger::create([
                'user_id' => $lockedUser->id,
                'transaction_id' => $transaction?->id,
                'direction' => $direction,
                'amount' => $amount,
                'balance_before' => $before,
                'balance_after' => $after,
                'provider' => $metadata['provider'] ?? null,
                'provider_reference' => $metadata['provider_reference'] ?? null,
                'reason' => $reason,
                'metadata' => $metadata,
                'idempotency_key' => $idempotencyKey,
            ]);
        });
    }
}
