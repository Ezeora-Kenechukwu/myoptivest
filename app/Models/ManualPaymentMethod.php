<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ManualPaymentMethod extends Model
{
    // use SoftDeletes;

    protected $fillable = [
        'name',
        'type',
        'instructions',
        'account_name',
        'account_number',
        'bank_name',
        'wallet_address',
        'active',
        'icon',
    ];
}

