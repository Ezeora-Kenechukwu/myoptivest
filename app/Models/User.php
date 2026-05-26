<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Illuminate\Contracts\Auth\MustVerifyEmail;
class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'ranking_id',
        'rankings',
        'avatar',
        'name',
        'type',
        'country',
        'phone',
        'username',
        'email',
        'gender',
        'date_of_birth',
        'city',
        'zip_code',
        'address',

        // Balances
        'savings_balance',
        'investment_balance',
        'withdrawable_savings_balance',
        'withdrawable_investment_balance',
        'investment_profit_balance',

        // Status Flags
        'status',
        'kyc',
        'kyc_credential',
        'two_fa',
        'deposit_status',
        'withdraw_status',
        'transfer_status',

        // Referral & Verification
        'ref_id', // This is the user who referred them
        'password',
        'countryCode',
        'referal_code'
    ];
    // protected $appends = ['referral_link'];

    protected static function booted(): void
    {
        static::creating(function ($user) {
            $user->refferal_code = static::generateUniqueReferralCode($user->name);
        });
    }

    private static function generateUniqueReferralCode(string $name): string
    {
        $base = strtolower(preg_replace('/[^a-z0-9]/i', '', $name));
        $base = substr($base, 0, 5) ?: 'user';

        do {
            $suffix = rand(1000, 9999);
            $code = strtoupper($base . $suffix);
        } while (static::where('refferal_code', $code)->exists());

        return $code;
    }
    protected $casts = [
        'rankings' => 'array',
        'kyc_credential' => 'array',
        'kyc' => 'boolean',
        'status' => 'boolean',
        'two_fa' => 'boolean',
        'deposit_status' => 'boolean',
        'withdraw_status' => 'boolean',
        'transfer_status' => 'boolean',
        'email_verified_at' => 'datetime',
    ];

    public function requiresEmailVerification(): bool
    {
        return $this->type === 'user';
    }

    public function hasVerifiedEmail()
    {
        if (!$this->requiresEmailVerification()) {
            return true;
        }

        return ! is_null($this->email_verified_at);
    }

    /*
    |----------------------------------------------------------------------
    | Relationships
    |----------------------------------------------------------------------
    */

    // Relationship to the ranking the user is part of
    // public function ranking()
    // {
    //     return $this->belongsTo(Ranking::class);
    // }
    public function transactions()
    {
        return $this->hasMany(Transaction::class,'user_id');
    }

    // Relationship for roles the user has
    public function roles()
    {
        return $this->belongsToMany(Role::class)->withTimestamps();
    }

    public function hasRole(string $role): bool
    {
        $roleSlug = Str::slug($role);

        return $this->roles()
            ->where(function ($query) use ($role, $roleSlug) {
                $query->where('name', $role)
                    ->orWhere('slug', $roleSlug);
            })
            ->exists();
    }

    public function hasPermissionTo(string $permission, string $ability = 'can_view'): bool
    {
        if ($this->type === 'admin') {
            return true;
        }

        $permissionSlug = Str::slug($permission);
        $abilities = $this->permissionAbilityAliases($ability);
        $permissionFilter = function ($query) use ($permission, $permissionSlug) {
            $query->where('name', $permission)
                ->orWhere('slug', $permissionSlug);
        };

        $directPermissions = $this->permissions()
            ->where($permissionFilter)
            ->get();

        foreach ($directPermissions as $directPermission) {
            if ($this->pivotAllowsAny($directPermission->pivot, $abilities)) {
                return true;
            }
        }

        $roles = $this->roles()
            ->with(['permissions' => function ($query) use ($permissionFilter) {
                $query->where($permissionFilter);
            }])
            ->get();

        foreach ($roles as $role) {
            foreach ($role->permissions as $rolePermission) {
                if ($this->pivotAllowsAny($rolePermission->pivot, $abilities)) {
                    return true;
                }
            }
        }

        return false;
    }

    protected function permissionAbilityAliases(string $ability): array
    {
        $aliases = [
            'can_destroy' => ['can_delete'],
            'can_show' => ['can_view'],
            'can_force_delete' => ['can_forceDelete'],
            'can_index_trash' => ['can_indexTrash'],
            'can_view_trash' => ['can_viewTrash'],
            'can_mark_as_read' => ['can_read'],
            'can_mark_all_as_read' => ['can_readall'],
            'can_toggle_active' => ['can_update', 'can_activate', 'can_deactivate'],
        ];

        return array_values(array_unique([
            $ability,
            ...($aliases[$ability] ?? []),
        ]));
    }

    protected function pivotAllowsAny($pivot, array $abilities): bool
    {
        foreach ($abilities as $ability) {
            if ((bool) ($pivot->{$ability} ?? false)) {
                return true;
            }
        }

        return false;
    }

    // Relationship for permissions the user has
    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'permission_user')
            ->withPivot([
                'can_create', 'can_edit', 'can_view', 'can_delete', 'can_forceDelete', 'can_index',
                'can_store', 'can_approve', 'can_restore', 'can_indexTrash', 'can_viewTrash',
                'can_assign', 'can_update', 'can_join', 'can_pin', 'can_share', 'can_copy',
                'can_download', 'can_preview', 'can_upload', 'can_pay', 'can_withdraw',
                'can_rank', 'can_show', 'can_block', 'can_unblock', 'can_activate', 'can_deactivate',
                'can_suspend', 'can_unsuspend', 'can_confirm', 'can_reply', 'can_send',
                'can_notify', 'can_read', 'can_readall',
            ])
            ->withTimestamps();
    }

    /**
     * Users this user has referred (direct downlines).
     */
    public function referrals()
    {
        return $this->hasMany(User::class, 'ref_id');
    }

    /**
     * The user who referred this user (if any).
     */
    public function referrer()
    {
        // A user is referred by another user, linked through the ref_id
        return $this->belongsTo(User::class, 'ref_id');
    }

    /**
     * Referral bonuses earned by this user.
     */
    public function referralBonuses()
    {
        return $this->hasMany(ReferralBonus::class, 'referrer_id');
    }

    /**
     * Bonuses triggered by this user (someone earned from my action).
     */
    public function bonusesTriggered()
    {
        return $this->hasMany(ReferralBonus::class, 'referred_id');
    }

    /**
     * Referrals this user made for a specific type (e.g., investment/savings).
     */
    public function referralsByType($type = 'investment')
    {
        return $this->referrals()->where('type', $type);
    }

    /**
     * Check if this user is eligible to receive bonuses
     * Only users with type 'user' can receive bonuses.
     */
    public function canReceiveBonus(string $type): bool
    {
        if ($this->type !== 'user') {
            return false; // Only 'user' type is eligible for bonuses
        }

        // Add additional checks like KYC, account status, etc., if needed
        return true;
    }

    /**
     * Check if the user has reached referral bonus limits for a given type
     * Returns true if the user has already reached the bonus limit for this type.
     */
    public function hasReachedReferralLimit(string $type): bool
    {
        $setting = ReferralSetting::where('type', $type)
            ->where('is_active', true)
            ->first();

        // If no setting exists or there's no max bonus count, return false (unlimited)
        if (!$setting || !$setting->max_bonus_count) {
            return false;
        }

        // Count how many referral bonuses the user has received for this type
        return $this->referralBonuses()
            ->where('type', $type)
            ->count() >= $setting->max_bonus_count;
    }

    /**
     * Relationship to referral bonuses (for beneficiaries)
     */
    // public function referralBonuses()
    // {
    //     return $this->hasMany(ReferralBonus::class, 'beneficiary_id');
    // }

    /**
     * Historical ranking information of the user.
     */
    public function rankingHistory()
    {
        return $this->belongsToMany(Ranking::class, 'ranking_user')->withTimestamps();
    }

    public function getReferralLinkAttribute(): string
{
    return route('register') . '?ref=' . $this->refferal_code;
}
}
