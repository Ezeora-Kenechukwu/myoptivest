<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Transaction extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id', 'type', 'amount', 'method', 'status', 'note',
        'approved_by', 'approved_at', 'confirmed_by', 'confirmed_at', 'proof','reference','paid_at','payment_reference',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
        'confirmed_at' => 'datetime',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function approvedBy() {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function confirmedBy() {
        return $this->belongsTo(User::class, 'confirmed_by');
    }
}
