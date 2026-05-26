<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailySaving extends Model
{
    use HasFactory;

    protected $fillable = [
        'saving_id',
        'user_id',
        'status',
        'type',
        'expected_payment_at',
        'amount',
        'paid_at',
        'processed_by',
        'transaction_reference',
        'failure_reason',
        'retry_count',
        'cancelled_at',
    ];

    protected $casts = [
        'status' => 'string',
        'type' => 'string',
        'expected_payment_at' => 'datetime',
        'paid_at' => 'datetime',
        'retry_count' => 'integer',
        'cancelled_at' => 'datetime',
    ];

    public function savingRecord()
    {
        return $this->belongsTo(Saving::class, 'saving_id');
    }

    public function savings()
    {
        return $this->savingRecord();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function processedBy()
    {
        return $this->belongsTo(User::class, 'processed_by');
    }
}
