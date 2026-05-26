<?php

// app/Models/ReferralSetting.php

// app/Models/ReferralSetting.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ReferralSetting extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'type',
        'is_active',
        'use_fixed_bonus',
        'fixed_bonus_amount',
        'use_percentage_bonus',
        'percentage_bonus',
        'bonus_limit_per_referee',
        'bonus_rate_tiers',
        'downline_levels',
        'downline_percentages',
        'slug',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'use_fixed_bonus' => 'boolean',
        'use_percentage_bonus' => 'boolean',
        'bonus_rate_tiers' => 'array',
        'downline_percentages' => 'array',
    ];
}
