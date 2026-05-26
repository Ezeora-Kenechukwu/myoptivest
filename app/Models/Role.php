<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
class Role extends Model
{
    /** @use HasFactory<\Database\Factories\RoleFactory> */
    use HasFactory,SoftDeletes;

    protected $fillable = [
        'name', 'slug', 'base_role','description', 'type','parent_role_id', 'active'
    ];
    public function users()
    {
        return $this->belongsToMany(User::class)->withTimestamps();
    }

    public function parent()
    {
        return $this->belongsTo(Role::class, 'parent_role_id');
    }

    public function children()
    {
        return $this->hasMany(Role::class, 'parent_role_id');
    }
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'role_permissions')
            ->withPivot([
                'can_create', 'can_edit', 'can_view', 'can_delete', 'can_forceDelete', 'can_index',
                'can_store', 'can_approve', 'can_restore', 'can_indexTrash', 'can_viewTrash',
                'can_assign', 'can_update', 'can_join', 'can_pin', 'can_share', 'can_copy',
                'can_download', 'can_preview', 'can_upload',
                'created_at', 'updated_at', 'can_pay',
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
    protected static function booted()
    {
        // static::saved(function ($permission) {
        //     HandleInertiaRequests::clearUserCache($permission->user_id);
        // });

        // static::deleted(function ($permission) {
        //     HandleInertiaRequests::clearUserCache($permission->user_id);
        // });
        static::creating(function ($role) {
            $role->slug = Str::slug($role->name);
        });

        static::updating(function ($role) {
            $role->slug = Str::slug($role->name);
        });
    }

 public function getRouteKeyName()
    {
        return 'slug';
    }
}
