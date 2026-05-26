<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Extract permission names from route files and code (controllers, middleware)
        $pathsToScan = [base_path('routes'), base_path('app')];

        $permissions = [];

        foreach ($pathsToScan as $path) {
            if (!File::isDirectory($path)) {
                continue;
            }

            $files = File::allFiles($path);

            foreach ($files as $file) {
                $contents = File::get($file->getRealPath());

                // middleware: 'permission:Something' occurrences
                if (preg_match_all('/permission:([A-Za-z0-9 _-]+)/', $contents, $matches)) {
                    foreach ($matches[1] as $m) {
                        $permissions[] = trim($m);
                    }
                }

                // direct checks like hasPermissionTo('Something')
                if (preg_match_all('/hasPermissionTo\(\s*["\']([^"\']+)["\']/', $contents, $m2)) {
                    foreach ($m2[1] as $m) {
                        $permissions[] = trim($m);
                    }
                }
            }
        }

        $permissions = array_values(array_unique($permissions));

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm], ['description' => 'Auto-seeded permission']);
        }

        // Create core roles
        $admin = Role::firstOrCreate(
            ['name' => 'Admin'],
            ['description' => 'System administrator', 'type' => 'admin', 'base_role' => true]
        );

        // Attach all permissions to admin role with full abilities
        $allAbilities = [
            'can_create','can_edit','can_view','can_delete','can_forceDelete','can_index','can_store','can_approve','can_restore','can_indexTrash','can_viewTrash','can_assign','can_update','can_join','can_pin','can_share','can_copy','can_download','can_preview','can_upload','can_pay','can_withdraw','can_rank','can_show','can_block','can_unblock','can_activate','can_deactivate','can_suspend','can_unsuspend','can_confirm','can_reply','can_send','can_notify','can_read','can_readall',
        ];

        $attachData = [];
        foreach (Permission::all() as $p) {
            $pivot = array_fill_keys($allAbilities, true);
            $attachData[$p->id] = $pivot;
        }

        if (!empty($attachData)) {
            $admin->permissions()->syncWithoutDetaching($attachData);
        }

        // Create basic roles (use allowed `type` values: admin, editor, user)
        Role::firstOrCreate(['name' => 'Staff'], ['description' => 'Staff user', 'type' => 'editor']);
        Role::firstOrCreate(['name' => 'User'], ['description' => 'Regular user', 'type' => 'user']);
        Role::firstOrCreate(['name' => 'Marketer'], ['description' => 'Marketer role', 'type' => 'user']);
    }
}
