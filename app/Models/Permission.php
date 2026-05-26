<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
class Permission extends Model
{
    /** @use HasFactory<\Database\Factories\PermissionFactory> */
    use HasFactory, SoftDeletes;


    protected $fillable = [
        'name',
        'slug',
        'description',
        'guard_name',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];


    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_permissions')
            ->withPivot([
                'can_create', 'can_edit', 'can_view', 'can_delete', 'can_forceDelete', 'can_index',
                'can_store', 'can_approve', 'can_restore', 'can_indexTrash', 'can_viewTrash',
                'can_assign', 'can_update', 'can_join', 'can_pin', 'can_share', 'can_copy',
                'can_download', 'can_preview', 'can_upload',
                'created_at', 
                'updated_at',
                'can_pay',
                'can_withdraw',
                'can_rank',
                'can_show',
                'can_block',
                'can_unblock',
                'can_activate',
                'can_deactivate',
                'can_suspend',
                'can_unsuspend',
                'can_confirm',
                'can_reply',
                'can_send',
                'can_notify',
                'can_read',
                'can_readall',
            ])->withTimestamps(); // Ensures timestamps are set
    }
    public function users()
    {
        return $this->belongsToMany(User::class, 'permission_user')
            ->withPivot([
                'can_create', 'can_edit', 'can_view', 'can_delete', 'can_forceDelete', 'can_index',
                'can_store', 'can_approve', 'can_restore', 'can_indexTrash', 'can_viewTrash',
                'can_assign', 'can_update', 'can_join', 'can_pin', 'can_share', 'can_copy',
                'can_download', 'can_preview', 'can_upload',  'can_pay',
                'can_withdraw',
                'can_rank',
                'can_show',
                'can_block',
                'can_unblock',
                'can_activate',
                'can_deactivate',
                'can_suspend',
                'can_unsuspend',
                'can_confirm',
                'can_reply',
                'can_send',
                'can_notify',
                'can_read',
                'can_readall',
            ])
            ->withTimestamps();
    }


    protected static function booted()
    {
        // static::saved(function ($permission) {
        //     HandleInertiaRequests::clearUserCache($permission->user_id);
        // });

        // static::deleted(function ($permission) {
        //     HandleInertiaRequests::clearUserCache($permission->user_id);
        // });
        static::creating(function ($permission) {
            $permission->slug = Str::slug($permission->name);
        });

        static::updating(function ($permission) {
            $permission->slug = Str::slug($permission->name);
        });
    }

 public function getRouteKeyName()
    {
        return 'slug';
    }
}
