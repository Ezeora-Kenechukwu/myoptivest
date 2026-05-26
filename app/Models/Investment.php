<?php

// app/Models/Investment.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Investment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'investment_plan_id', 'invest_amount', 'roi',
        'number_of_periods', 'period_hours', 'payout_frequency',
        'total_expected_profit', 'profit_paid_count',
        'last_profit_at', 'next_profit_at',
        'capital_back', 'status', 'approved_by', 'approved_at', 'rejected_by', 'rejected_at'
    ];

    protected $casts = [
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
        'last_profit_at' => 'datetime',
        'next_profit_at' => 'datetime',
        'capital_back' => 'boolean',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function plan() {
        return $this->belongsTo(InvestmentPlan::class, 'investment_plan_id');
    }

    public function approver() {
        return $this->belongsTo(User::class, 'approved_by');
    }
    public function rejector() {
        return $this->belongsTo(User::class, 'rejected_by');
    }
}
