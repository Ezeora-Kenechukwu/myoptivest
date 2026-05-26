<?php

namespace App\Traits;

use App\Enums\MembershipType;
use App\Models\User;
use App\Models\Role;
use App\Notifications\MembershipAcceptedByUser;
use App\Notifications\MembershipActivatedByAdmin;
use App\Notifications\MembershipRequestedByAdmin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Validation\Rules;
trait UserManagementTrait
{
    protected function getViewComponent()
    {
        return match ($this->userType) {
            'admin' => 'UserManager/AdminManager',
            'staff' => 'UserManager/StaffManager',
            'user' => 'UserManager/UserManager',
            default => null
        };
    }

   public function index()
{
    $users = User::where('type', $this->userType)
        ->with(['roles','referrer'])
        ->paginate(20)
        ->through(function ($user) {
            $user->referral_link = $user->referral_link; // accessor will run here
            return $user;
        });

    $component = $this->getViewComponent();
    
    return $component ? Inertia::render($component, [
        'users' => $users,
        'roles' => Role::where('type', $this->userType)->get(),
    ]) : back();
}


    public function store(Request $request)
    {
        $data =  $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'phone' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'gender' => 'required|in:male,female,other',
            'date_of_birth' => 'required|date',
            'city' => 'nullable|string|max:100',
            'zip_code' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'avatar' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'ref_id' => 'nullable|integer|exists:users,id',
        ]);
    
        // Handle avatar upload
        $avatarPath = null;
        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatar', 'public');
        }
    
        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'phone' => $request->phone,
            'country' => $request->country,
            'gender' => $request->gender,
            'date_of_birth' => $request->date_of_birth,
            'city' => $request->city,
            'zip_code' => $request->zip_code,
            'address' => $request->address,
            'ref_id' => $request->ref_id,
            'type' => $this->userType,
            'avatar' => $avatarPath,
            'password' => Hash::make($request->password),
        ]);

        if ($role = Role::find($this->defaultRoleId)) {
            $user->roles()->attach($role->id);
            foreach ($role->permissions as $perm) {
                $user->permissions()->syncWithoutDetaching([
                    $perm->id => array_fill_keys([
                        'can_create', 'can_edit', 'can_view', 'can_delete', 'can_forceDelete', 'can_index',
                        'can_store', 'can_approve', 'can_restore', 'can_indexTrash', 'can_viewTrash',
                        'can_assign', 'can_update', 'can_join', 'can_pin', 'can_share', 'can_copy',
                        'can_download', 'can_preview', 'can_upload', 'can_pay', 'can_withdraw',
                        'can_rank', 'can_show', 'can_block', 'can_unblock', 'can_activate', 'can_deactivate',
                        'can_suspend', 'can_unsuspend', 'can_confirm', 'can_reply', 'can_send',
                        'can_notify', 'can_read', 'can_readall',
                    ], true)
                ]);
            }
        }

        return back()->with('success', 'User created.');
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|confirmed|min:6',
        ]);

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return back()->with('success', 'User updated.');
    }

    public function destroy(User $user)
    {
        $user->roles()->detach();
        $user->permissions()->detach();
        $user->delete();

        return back()->with('success', 'User deleted.');
    }

    public function suspend(User $user)
    {
        $user->update(['suspended' => true]);
        return back()->with('success', 'User suspended.');
    }
    public function unsuspend(User $user)
    {
        $user->update(['suspended' => false]);
        return back()->with('success', 'User Activated.');
    }

    public function assignRole(Request $request, User $user)
{
    $request->validate([
        'role_ids' => 'required|array',
        'role_ids.*' => 'exists:roles,id',
    ]);

    $roles = Role::whereIn('id', $request->role_ids)->get();

    // Ensure all roles match the user's type
    foreach ($roles as $role) {
        if ($role->type !== $user->type) {
            return back()->withErrors(['role_ids' => 'All roles must match user type.']);
        }
    }

    // Attach roles without detaching existing ones
    $user->roles()->syncWithoutDetaching($roles->pluck('id'));

    // Attach permissions from all roles
    foreach ($roles as $role) {
        foreach ($role->permissions as $perm) {
            $user->permissions()->syncWithoutDetaching([
                $perm->id => array_fill_keys([
                    'can_create', 'can_edit', 'can_view', 'can_delete', 'can_forceDelete', 'can_index',
                'can_store', 'can_approve', 'can_restore', 'can_indexTrash', 'can_viewTrash',
                'can_assign', 'can_update', 'can_join', 'can_pin', 'can_share', 'can_copy',
                'can_download', 'can_preview', 'can_upload', 'can_pay', 'can_withdraw',
                'can_rank', 'can_show', 'can_block', 'can_unblock', 'can_activate', 'can_deactivate',
                'can_suspend', 'can_unsuspend', 'can_confirm', 'can_reply', 'can_send',
                'can_notify', 'can_read', 'can_readall',
                ], true),
            ]);
        }
    }

    return back()->with('success', 'Roles and permissions assigned.');
}


    public function removeRole(User $user, $roleId)
    {
        $role = Role::find($roleId);

        if ($role) {
            foreach ($role->permissions as $perm) {
                $user->permissions()->detach($perm->id);
            }

            $user->roles()->detach($roleId);
        }

        return back()->with('success', 'Role and permissions removed.');
    }

    public function verifyEmail(User $user)
    {
        $user->update(['email_verified_at' => now()]);
        return back()->with('success', 'Email marked as verified.');
    }

    public function requestMembershipValidation(Request $request, User $user)
    {
        $validated = $request->validate([
            'membership_activation_amount' => 'required|numeric|min:0',
            'membership_type' => ['required', 'in:bronze,silver,gold,platinum,diamond'],
        ]);

        $user->update([
            'should_activate_membership' => true,
            'membership_activation_amount' => $validated['membership_activation_amount'],
            'membership_type' => $validated['membership_type'],
        ]);
        $user->notify(new MembershipRequestedByAdmin(auth()->user()));
        return back()->with('success', 'Membership activation requested.');
    }

    public function acceptMembership(Request $request, User $user)
    {
        $validated = $request->validate([
            // 'membership_type' => ['required', new Enum(MembershipType::class)],
        ]);

        $user->update([
            'membership_code' => $user->membership_code ?? User::generateUniqueMembershipCode(),
            'membership_status' => 'accepted',
        ]);
 // Notify all admins (you can customize this to target specific admin users)
 $admins = User::where('type', 'admin')->get();
 foreach ($admins as $admin) {
     $admin->notify(new MembershipAcceptedByUser($user));
 }
        return back()->with('success', 'Membership accepted.');
    }

    public function activateMembership(User $user)
    {
        $user->update([
            'membership_activated' => true,
            'membership_activated_on' => now(),
            'should_activate_membership' => false,
            'membership_status' => 'validated',
        ]);
        $user->notify(new MembershipActivatedByAdmin(auth()->user()));
        return back()->with('success', 'Membership Validated.');
    }
}
