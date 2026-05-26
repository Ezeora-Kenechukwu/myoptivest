<?php

namespace App\Http\Controllers;

use App\Models\Bank;
use App\Traits\UserManagementTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    use UserManagementTrait;

    protected string $userType = 'user';
    protected int $defaultRoleId = 3;

    public function kyc(){

        return Inertia::render('auth/completeRegistration', [
            'banks' => Bank::all(),
        ]);
    }


public function storeKyc(Request $request)
{
    $user = auth()->user();

    $validated = $request->validate([
        'username'          => ['required', 'string', 'max:255', Rule::unique('users')->ignore($user->id)],
        'country'           => ['required', 'string', 'max:100'],
        'gender'            => ['required', 'in:male,female,other'],
        'address'           => ['required', 'string', 'max:255'],
        'date_of_birth'     => ['required', 'date'],
        'city'              => ['required', 'string', 'max:100'],
        'zip_code'          => ['required', 'string', 'max:20'],
        'avatar'            => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
        'account_number'    => ['required', 'string', 'max:20'],
        'bank'              => ['required'],
        'account_name'      => ['required', 'string', 'max:255'],
        'reason'            => ['nullable', 'string', 'max:255'],
        'pin'               => ['required', 'confirmed', 'digits:4'],
    ]);

    // Handle avatar upload if provided
    if ($request->hasFile('avatar')) {
        $avatarPath = $request->file('avatar')->store('avatar', 'public');
        $user->avatar = $avatarPath;
    }

    // Update user with validated data
    $user->update([
        'username'        => $validated['username'],
        'country'         => $validated['country'],
        'gender'          => $validated['gender'],
        'address'         => $validated['address'],
        'date_of_birth'   => $validated['date_of_birth'],
        'city'            => $validated['city'],
        'zip_code'        => $validated['zip_code'],
        'account_number'  => $validated['account_number'],
        'bank'            => $validated['bank'],
        'account_name'    => $validated['account_name'],
        'reason'          => $validated['reason'] ?? null,
        'pin'             => Hash::make($validated['pin']),
        'kyc'             => true,
    ]);

    return redirect()->route('dashboard')->with('success', 'KYC completed successfully.');
}

}
