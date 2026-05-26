<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MonnifyTransaction extends Model
{
    protected $fillable = [
    'reference',
    'payment_reference',
    'customer_name',
    'customer_email',
    'amount',
    'payment_method',
    'status',
    'response',
    'account_number',
    'account_name',
    'bank_name',
    'account_expiry',
    'paid_at',
];
}
