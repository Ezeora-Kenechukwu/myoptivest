<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;
 use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Str;
class RegisteredUserController extends Controller 
{
    /**
 * Show the registration page.
 */
public function create(Request $request): Response
{
    // Retrieve the ref parameter from the URL if present
    $ref = $request->query('ref');
// dd($ref);
    return Inertia::render('auth/register', [
        'ref' => $ref,  // Pass ref_id as a prop to the view
    ]);
}

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */

public function store(Request $request): RedirectResponse 
{
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users,email',
        'phone' => 'required|string|max:20',
        'countryCode' => 'required|string|max:4',
        'country' => 'nullable|string|max:100',
        'ref_id' => 'nullable|string|exists:users,refferal_code',
        'password' => [
            'required',
            'confirmed',
            Password::min(8)
                ->mixedCase()
                ->numbers()
                ->symbols(),
        ],
    ]);

    $refUserId = null;
    if ($request->filled('ref_id')) {
        $refUserId = User::where('refferal_code', $request->ref_id)->value('id');
    }

    $user = User::create([
        'name' => $request->name,
        'username' => $this->generateUniqueUsername($request->name, $request->email),
        'email' => $request->email,
        'phone' => $request->phone,
        'country' => $request->input('country', 'Nigeria'),
        'countryCode' => $request->countryCode,
        'ref_id' => $refUserId,
        'password' => Hash::make($request->password),
        'type' => 'user',
      
    ]);

    if ($role = Role::find(3)) {
        $user->roles()->attach($role->id);
        $user->permissions()->syncWithoutDetaching(
            $role->permissions->pluck('id')->mapWithKeys(fn ($id) => [
                $id => array_fill_keys([
                    'can_create', 'can_edit', 'can_view', 'can_delete', 'can_forceDelete', 'can_index',
                    'can_store', 'can_approve', 'can_restore', 'can_indexTrash', 'can_viewTrash',
                    'can_assign', 'can_update', 'can_join', 'can_pin', 'can_share', 'can_copy',
                    'can_download', 'can_preview', 'can_upload', 'can_pay', 'can_withdraw',
                    'can_rank', 'can_show', 'can_block', 'can_unblock', 'can_activate', 'can_deactivate',
                    'can_suspend', 'can_unsuspend', 'can_confirm', 'can_reply', 'can_send',
                    'can_notify', 'can_read', 'can_readall',
                ], true)
            ])->toArray()
        );
    }

    event(new Registered($user));
    Auth::login($user);

    return redirect()->route('dashboard');
}

private function generateUniqueReferralCode(string $name): string
{
    // Clean name: remove non-alphanumeric characters and convert to lowercase
    $base = strtolower(preg_replace('/[^a-z0-9]/i', '', $name));

    // Use first 5 characters of the name, or fallback to 'user'
    $base = substr($base, 0, 5) ?: 'user';

    do {
        $suffix = rand(1000, 9999); // or use Str::random(4) if preferred
        $code = $base . $suffix;
    } while (User::where('refferal_code', $code)->exists());

    return strtoupper($code); // Optional: uppercase for readability
}

private function generateUniqueUsername(string $name, string $email): string
{
    $base = Str::slug($name, '');
    $base = $base ?: Str::before($email, '@');
    $base = substr(preg_replace('/[^a-z0-9]/i', '', $base), 0, 20) ?: 'user';

    $username = $base;
    $counter = 1;

    while (User::where('username', $username)->exists()) {
        $username = $base . $counter;
        $counter++;
    }

    return $username;
}





}
