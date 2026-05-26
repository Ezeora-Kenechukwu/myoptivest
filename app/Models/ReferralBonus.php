<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ReferralBonus extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'referrer_id',
        'referred_id',
        'type',
        'amount',
        'level',
        'referral_setting_id',
        'source_type',
        'source_id',
        'slug'
    ];

    public function referrer() {
        return $this->belongsTo(User::class, 'referrer_id');
    }

    public function referred() {
        return $this->belongsTo(User::class, 'referred_id');
    }

    public function source() {
        return $this->morphTo();
    }

    public function setting() {
        return $this->belongsTo(ReferralSetting::class, 'referral_setting_id');
    }
}

