<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WalletLedger extends Model
{
    protected $fillable = [
        'user_id',
        'transaction_id',
        'direction',
        'amount',
        'balance_before',
        'balance_after',
        'provider',
        'provider_reference',
        'reason',
        'metadata',
        'idempotency_key',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'balance_before' => 'decimal:2',
        'balance_after' => 'decimal:2',
        'metadata' => 'array',
    ];
}
