<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index()
    {
        // dd('hello');
        $roles = Role::with('permissions')->withTrashed()->latest()->paginate(10);
        $permissions = Permission::all();
        return Inertia::render('Roles/Index', [
            'roles' => $roles,
            'permissions' => $permissions
        ]);
    }

    public function create()
    {
        $roles = Role::where('base_role', true)->get();

        return Inertia::render('Roles/Create', [
            'roles' => $roles
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|unique:roles,name',
            'description' => 'required|string',
            // 'base_role' => 'boolean',
            'type' => 'required|in:user,admin,editor',
            'parent_role_id' => 'nullable|exists:roles,id',
            // 'permissions' => 'array'
        ]);

        $role = Role::create($data);
        // $role->permissions()->sync($data['permissions'] ?? []);

        return redirect()->route('roles.index')
            ->with('success', 'Role created successfully.');
    }

    public function edit(Role $role)
    {
        // $permissions = Permission::all();
        $role->load('permissions');
        $roles = Role::where('base_role', true)->get();

        return Inertia::render('Roles/Edit', [
            'role' => $role,
            'roles' => $roles,
            // 'permissions' => $permissions
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $data = $request->validate([
            'name' => 'required|string|unique:roles,name,' . $role->id,
            // 'base_role' => 'boolean',
            'type' => 'required|in:user,admin,editor',
            'parent_role_id' => 'nullable|exists:roles,id',
            // 'permissions' => 'array'
        ]);

        $role->update($data);
        // $role->permissions()->sync($data['permissions'] ?? []);

        return redirect()->route('roles.index')
            ->with('success', 'Role updated successfully.');
    }
  /**
     * Assign permissions to a role.
     */


    public function assignPermissions(Request $request, Role $role)
    {
        $validated = $request->validate([
            'permissions' => 'required|array',
            'permissions.*.permission_id' => 'required|exists:permissions,id',
            'permissions.*.can_create' => 'boolean',
            'permissions.*.can_edit' => 'boolean',
            'permissions.*.can_view' => 'boolean',
            'permissions.*.can_delete' => 'boolean',
            'permissions.*.can_forceDelete' => 'boolean',
            'permissions.*.can_index' => 'boolean',
            'permissions.*.can_store' => 'boolean',
            'permissions.*.can_approve' => 'boolean',
            'permissions.*.can_restore' => 'boolean',
            'permissions.*.can_indexTrash' => 'boolean',
            'permissions.*.can_viewTrash' => 'boolean',
            'permissions.*.can_assign' => 'boolean',
            'permissions.*.can_update' => 'boolean',
            'permissions.*.can_join' => 'boolean',
            'permissions.*.can_pin' => 'boolean',
            'permissions.*.can_share' => 'boolean',
            'permissions.*.can_copy' => 'boolean',
            'permissions.*.can_download' => 'boolean',
            'permissions.*.can_preview' => 'boolean',
            'permissions.*.can_upload' => 'boolean',
            'permissions.*.can_pay' => 'boolean',
            'permissions.*.can_withdraw' => 'boolean',
            'permissions.*.can_rank' => 'boolean',
            'permissions.*.can_show' => 'boolean',
            'permissions.*.can_block' => 'boolean',
            'permissions.*.can_unblock' => 'boolean',
            'permissions.*.can_activate' => 'boolean',
            'permissions.*.can_deactivate' => 'boolean',
            'permissions.*.can_suspend' => 'boolean',
            'permissions.*.can_unsuspend' => 'boolean',
            'permissions.*.can_confirm' => 'boolean',
            'permissions.*.can_reply' => 'boolean',
            'permissions.*.can_send' => 'boolean',
            'permissions.*.can_notify' => 'boolean',
            'permissions.*.can_read' => 'boolean',
            'permissions.*.can_readall' => 'boolean',
        ]);

        // Map permission data for syncing
        $permissionsData = collect($validated['permissions'])->mapWithKeys(function ($perm) {
            return [
                $perm['permission_id'] => [
                    'can_create' => $perm['can_create'] ?? false,
                    'can_edit' => $perm['can_edit'] ?? false,
                    'can_view' => $perm['can_view'] ?? false,
                    'can_delete' => $perm['can_delete'] ?? false,
                    'can_forceDelete' => $perm['can_forceDelete'] ?? false,
                    'can_index' => $perm['can_index'] ?? false,
                    'can_store' => $perm['can_store'] ?? false,
                    'can_approve' => $perm['can_approve'] ?? false,
                    'can_restore' => $perm['can_restore'] ?? false,
                    'can_indexTrash' => $perm['can_indexTrash'] ?? false,
                    'can_viewTrash' => $perm['can_viewTrash'] ?? false,
                    'can_assign' => $perm['can_assign'] ?? false,
                    'can_update' => $perm['can_update'] ?? false,
                    'can_join' => $perm['can_join'] ?? false,
                    'can_pin' => $perm['can_pin'] ?? false,
                    'can_share' => $perm['can_share'] ?? false,
                    'can_copy' => $perm['can_copy'] ?? false,
                    'can_download' => $perm['can_download'] ?? false,
                    'can_preview' => $perm['can_preview'] ?? false,
                    'can_upload' => $perm['can_upload'] ?? false,
                    'can_pay' => $perm['can_pay'] ?? false,
                    'can_withdraw' => $perm['can_withdraw'] ?? false,
                    'can_rank' => $perm['can_rank'] ?? false,
                    'can_show' => $perm['can_show'] ?? false,
                    'can_block' => $perm['can_block'] ?? false,
                    'can_unblock' => $perm['can_unblock'] ?? false,
                    'can_activate' => $perm['can_activate'] ?? false,
                    'can_deactivate' => $perm['can_deactivate'] ?? false,
                    'can_suspend' => $perm['can_suspend'] ?? false,
                    'can_unsuspend' => $perm['can_unsuspend'] ?? false,
                    'can_confirm' => $perm['can_confirm'] ?? false,
                    'can_reply' => $perm['can_reply'] ?? false,
                    'can_send' => $perm['can_send'] ?? false,
                    'can_notify' => $perm['can_notify'] ?? false,
                    'can_read' => $perm['can_read'] ?? false,
                    'can_readall' => $perm['can_readall'] ?? false,
                ]
            ];
        })->toArray();

        // Sync role_permission pivot table
        $role->permissions()->sync($permissionsData);

        // Remove old role_permissions not in the current request
        $newPermissionIds = array_keys($permissionsData);
        DB::table('role_permissions')
            ->where('role_id', $role->id)
            ->whereNotIn('permission_id', $newPermissionIds)
            ->delete();

        // Only users who currently have this role
        $usersWithRole = $role->users;

        foreach ($usersWithRole as $user) {
            foreach ($permissionsData as $permissionId => $abilities) {
                $existing = DB::table('permission_user')
                    ->where('user_id', $user->id)
                    // ->where('role_id', $role->id)
                    ->where('permission_id', $permissionId)
                    ->first();

                if ($existing) {
                    DB::table('permission_user')
                        ->where('id', $existing->id)
                        ->update(array_merge($abilities, ['updated_at' => now()]));
                } else {
                    DB::table('permission_user')->insert(array_merge([
                        'user_id' => $user->id,
                        // 'role_id' => $role->id,
                        'permission_id' => $permissionId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ], $abilities));
                }
            }
        }

        return back()->with('success', 'Permissions assigned successfully.');
    }




    /**
     * Remove the specified role.
     */
    public function destroy(Role $role)
    {
        DB::transaction(function () use ($role) {
            // Unassign all permissions
            $role->permissions()->detach();
            $role->permissionsUsers()->detach();

            // Unassign role from users
            $role->users()->detach();

            // Delete the role
            $role->delete();
        });

        return redirect()->route('administrator.roles.index')->with('success', 'Role deleted successfully.');
    }
    // public function destroy(Role $role)
    // {
    //     $role->delete();

    //     return back()->with('success', 'Role soft deleted.');
    // }

    public function restore($id)
    {
        $role = Role::withTrashed()->findOrFail($id);
        $role->restore();

        return back()->with('success', 'Role restored.');
    }

    public function forceDelete($id)
    {
        $role = Role::withTrashed()->findOrFail($id);
        $role->forceDelete();

        return back()->with('success', 'Role permanently deleted.');
    }

    public function activate($id)
    {
        $role = Role::withTrashed()->findOrFail($id);
        $role->active = true;
        $role->save();

        return back()->with('success', 'Role activated.');
    }

    public function deactivate($id)
    {
        $role = Role::withTrashed()->findOrFail($id);
        $role->active = false;
        $role->save();

        return back()->with('success', 'Role deactivated.');
    }
}
