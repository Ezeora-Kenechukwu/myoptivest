<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PermissionController extends Controller
{
    public function index(): Response
    {
        $permissions = Permission::withTrashed()->latest()->paginate(1000);

        return Inertia::render('Permissions/Index', [
            'permissions' => $permissions
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Permissions/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|unique:permissions,name',
            'description' => 'required|string',
            // 'slug' => 'required|string|unique:permissions,slug',
            'guard_name' => 'string|nullable',
            'active' => 'boolean|nullable'
        ]);

        Permission::create($data);

        return redirect()->route('permissions.index')
            ->with('success', 'Permission created successfully.');
    }

    public function show(Permission $permission): Response
    {
        return Inertia::render('Permissions/Show', [
            'permission' => $permission
        ]);
    }

    public function edit(Permission $permission): Response
    {
        return Inertia::render('Permissions/Edit', [
            'permission' => $permission
        ]);
    }

    public function update(Request $request, Permission $permission)
    {
        $data = $request->validate([
            'name' => 'required|string|unique:permissions,name,' . $permission->id,
            'description' => 'required|string',
            'guard_name' => 'string|nullable',
            'active' => 'boolean|nullable'
        ]);

        $permission->update($data);

        return redirect()->route('permissions.index')
            ->with('success', 'Permission updated successfully.');
    }

    public function destroy(Permission $permission)
    {
        $permission->delete();

        return back()->with('success', 'Permission soft deleted.');
    }

    public function restore($id)
    {
        $permission = Permission::withTrashed()->findOrFail($id);
        $permission->restore();

        return back()->with('success', 'Permission restored.');
    }

    public function forceDelete($id)
    {
        $permission = Permission::withTrashed()->findOrFail($id);
        $permission->forceDelete();

        return back()->with('success', 'Permission permanently deleted.');
    }

    public function activate($id)
    {
        $permission = Permission::withTrashed()->findOrFail($id);
        $permission->active = true;
        $permission->save();

        return back()->with('success', 'Permission activated.');
    }

    public function deactivate($id)
    {
        $permission = Permission::withTrashed()->findOrFail($id);
        $permission->active = false;
        $permission->save();

        return back()->with('success', 'Permission deactivated.');
    }
}
