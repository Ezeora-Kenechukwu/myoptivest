<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('ADMIN_EMAIL', 'admin@example.com');
        $password = env('ADMIN_PASSWORD', 'password');

        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => 'Administrator',
                'username' => 'administrator',
                'password' => Hash::make($password),
                'country' => 'NG',
                'countryCode' => '+234',
                'phone' => '0000000000',
                'type' => 'admin',
            ]
        );

        // Ensure admin is marked as email-verified so 'verified' middleware passes
        if (empty($user->email_verified_at)) {
            $user->email_verified_at = now();
            $user->save();
        }

        // assign admin role
        $adminRole = Role::where('name', 'Admin')->first();
        if ($adminRole) {
            $user->roles()->syncWithoutDetaching([$adminRole->id]);
        }

        // ensure user has explicit permissions entries (optional since type=admin bypasses checks)
        $allAbilities = [
            'can_create','can_edit','can_view','can_delete','can_forceDelete','can_index','can_store','can_approve','can_restore','can_indexTrash','can_viewTrash','can_assign','can_update','can_join','can_pin','can_share','can_copy','can_download','can_preview','can_upload','can_pay','can_withdraw','can_rank','can_show','can_block','can_unblock','can_activate','can_deactivate','can_suspend','can_unsuspend','can_confirm','can_reply','can_send','can_notify','can_read','can_readall',
        ];

        $attachData = [];
        foreach (Permission::all() as $p) {
            $attachData[$p->id] = array_fill_keys($allAbilities, true);
        }

        if (!empty($attachData)) {
            $user->permissions()->syncWithoutDetaching($attachData);
        }
    }
}
