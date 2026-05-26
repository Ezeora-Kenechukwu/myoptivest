# OptiVest Full Findings, Fix Recommendations, and Implementation Report

**Project:** OptiVest Laravel + Inertia React fintech/investment platform  
**Purpose:** Future reference for security, backend, frontend, UI, mobile-responsiveness, payment, wallet, and documentation fixes.  
**Generated for:** OptiVest project maintainers and future developers.  
**Date:** 2026-05-23

---

## 1. Executive Summary

The OptiVest codebase is a feature-rich Laravel/Inertia React financial platform covering wallet funding, Monnify payments, investments, savings, loans, referrals, notifications, role/permission management, user management, and admin operations.

The original review found that the system had several production-blocking issues:

1. Permission middleware was effectively disabled.
2. Some admin/user-management routes were not protected by parent authentication middleware.
3. Monnify payment routes were public while expecting an authenticated user.
4. Wallet funding could be credited from multiple sources without a strong database-level idempotency pattern.
5. Raw card PAN/CVV/PIN routes exposed the platform to PCI-DSS compliance risk.
6. Loan and savings financial logic used inconsistent wallet fields and unsafe refund/disbursement patterns.
7. The frontend production build failed because of case-sensitive imports and missing/misnamed assets.
8. The frontend TypeScript check failed.
9. The design implementation was inconsistent with the supplied Figma direction and was not mobile-first.
10. SQL dumps containing sensitive payment/user data were present in the package.
11. Admin and user tutorials/documentation pages were missing.

A patched source package was created to stabilize the project. This document explains the findings, the recommended fixes, and the implemented code.

---

## 2. Validation Summary

The following checks were performed on the patched package:

```bash
npm run types
npm run build
php -l app routes database
php artisan route:list
```

### Passed

- PHP syntax checks passed.
- TypeScript checks passed after frontend fixes.
- Vite production build passed after import/path fixes.
- Laravel route list was able to compile.
- SQL dumps were removed from the fixed source package.
- Admin and user documentation pages were added.

### Blocked

Laravel/Pest test execution was blocked in the environment because the PHP DOM/XML extension was missing:

```text
Class "DOMDocument" not found
```

On a real development/server environment, enable PHP XML/DOM and run:

```bash
php artisan test
```

For Ubuntu-like systems:

```bash
sudo apt install php-xml
```

---

## 3. Production Readiness Verdict

Before the fixes, OptiVest was **not production-ready** because of authorization bypasses, exposed routes, payment idempotency risks, frontend build failure, and financial logic inconsistencies.

After the fixes, the system is significantly safer and buildable, but future maintainers should still add automated feature tests for:

- permission enforcement,
- payment idempotency,
- wallet ledger movements,
- loan ownership checks,
- savings cancellation refund correctness,
- Monnify webhook signature handling,
- admin/user route access.

---

## 4. Critical Findings and Fixes

### 4.1 Permission Middleware Bypass

#### Finding

The original permission middleware returned `$next($request)` before performing permission checks. That meant routes using `permission:...` appeared protected but were effectively open to any request that reached them.

#### Risk

This was a **critical authorization bypass**. Admin, staff, user-management, payment, and transaction operations could be reached without real permission enforcement depending on route grouping.

#### Recommendation

Remove the early return, resolve the authenticated user, derive the requested ability, and reject users without the correct permission.

#### Implementation

The middleware now checks:

- authenticated user exists,
- the user model supports `hasPermissionTo`,
- the requested permission and ability match,
- JSON requests receive 403,
- browser requests are redirected safely.


### `app/Http/Middleware/CheckPermissionAbility.php` — Implemented permission ability middleware

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class CheckPermissionAbility
{
    public function handle(Request $request, Closure $next, string $permission, ?string $ability = null): Response
    {
        $user = $request->user();

        if (!$user) {
            return $this->forbiddenResponse($request, 'Unauthorized');
        }

        $ability = $ability ?: 'can_' . Str::snake($request->route()?->getActionMethod() ?: 'index');

        if (!method_exists($user, 'hasPermissionTo') || !$user->hasPermissionTo($permission, $ability)) {
            return $this->forbiddenResponse($request, 'Forbidden');
        }

        return $next($request);
    }

    protected function forbiddenResponse(Request $request, string $message = 'Forbidden'): Response
    {
        if ($request->expectsJson()) {
            abort(403, $message);
        }

        return redirect()->route('dashboard')->with('error', $message);
    }
}
```


### `app/Http/Middleware/CheckPermission.php` — Implemented permission middleware

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    public function handle(Request $request, Closure $next, string $permission, ?string $ability = null): Response
    {
        $user = $request->user();

        if (!$user) {
            return $this->deny($request, 'Unauthorized');
        }

        $ability = $ability ?: 'can_' . Str::snake($request->route()?->getActionMethod() ?: 'index');

        if (!method_exists($user, 'hasPermissionTo') || !$user->hasPermissionTo($permission, $ability)) {
            return $this->deny($request, 'Forbidden: You do not have permission to access this resource.');
        }

        return $next($request);
    }

    private function deny(Request $request, string $message): Response
    {
        if ($request->expectsJson()) {
            abort(403, $message);
        }

        return redirect()->route('dashboard')->with('error', $message);
    }
}
```


---

### 4.2 Exposed Admin, Staff, and User Routes

#### Finding

Admin, staff, and regular-user management route groups were relying heavily on the disabled permission middleware. Some groups were outside the parent `auth`, `verified`, and `kyc` middleware group.

#### Risk

Route exposure could allow unauthenticated or unauthorized users to reach sensitive account-management operations.

#### Recommendation

Wrap user-management route groups with `auth`, `verified`, and `kyc`, then apply granular permission middleware per action.

#### Implementation

The route structure was updated so sensitive user-management routes require authenticated, verified, KYC-completed users before permission checks are evaluated.


### `routes/user.php` — Protected user-management route groups

```php
<?php

use App\Http\Controllers\PermissionController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\StaffUserController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\NotificationController;
Route::middleware(['auth', 'verified','kyc'])->group(function () {
    Route::resource('permissions', PermissionController::class)->middleware('permission:Permission');

    Route::prefix('permissions')->group(function () {
        Route::post('{id}/restore', [PermissionController::class, 'restore'])->name('permissions.restore')->middleware('permission:Permission,can_restore');
        Route::delete('{id}/force-delete', [PermissionController::class, 'forceDelete'])->name('permissions.forceDelete')->middleware('permission:Permission');
        Route::post('{id}/activate', [PermissionController::class, 'activate'])->name('permissions.activate')->middleware('permission:Permission,can_approve');
        Route::post('{id}/deactivate', [PermissionController::class, 'deactivate'])->name('permissions.deactivate')->middleware('permission:Permission,can_approve');
    });


    Route::resource('roles', RoleController::class)->middleware('permission:Role');

    Route::prefix('roles')->group(function () {
        Route::post('{id}/restore', [RoleController::class, 'restore'])->name('roles.restore')->middleware('permission:Role');
        Route::post('{role}/assignPermissions', [RoleController::class, 'assignPermissions'])->name('roles.assignPermissions')->middleware('permission:Role,can_assign');
        Route::delete('{id}/force-delete', [RoleController::class, 'forceDelete'])->name('roles.forceDelete')->middleware('permission:Role');
        Route::post('{id}/activate', [RoleController::class, 'activate'])->name('roles.activate')->middleware('permission:Role,can_approve');
        Route::post('{id}/deactivate', [RoleController::class, 'deactivate'])->name('roles.deactivate')->middleware('permission:Role,can_approve');
    });


});



Route::middleware(['auth', 'verified', 'kyc'])->group(function () {
    Route::prefix('admins')->name('admins.')->controller(AdminUserController::class)->group(function () {
        Route::get('/', 'index')->name('index')->middleware('permission:Admin Manager');
        Route::get('/create', 'create')->name('create')->middleware('permission:Admin Manager');
        Route::post('/', 'store')->name('store')->middleware('permission:Admin Manager');
        Route::get('/{user}', 'show')->name('show')->middleware('permission:Admin Manager,can_view');
        Route::get('/{user}/edit', 'edit')->name('edit')->middleware('permission:Admin Manager');
        Route::put('/{user}', 'update')->name('update')->middleware('permission:Admin Manager');
        Route::put('/{user}/suspend', 'suspend')->name('suspend')->middleware('permission:Admin Manager,can_approve');
        Route::put('/{user}/unsuspend', 'unsuspend')->name('unsuspend')->middleware('permission:Admin Manager,can_approve');
        Route::post('/{user}/assign-role', 'assignRole')->name('assignRole')->middleware('permission:Admin Manager,can_assign');
        Route::delete('/{user}/remove-role/{roleId}', 'removeRole')->name('removeRole')->middleware('permission:Admin Manager,can_assign');
        Route::put('/{user}/verify-email', 'verifyEmail')->name('verifyEmail')->middleware('permission:Admin Manager,can_approve');
        Route::delete('/{user}', 'destroy')->name('destroy')->middleware('permission:Admin Manager,can_delete');
    });

    Route::prefix('staff')->name('staff.')->controller(StaffUserController::class)->group(function () {
        Route::get('/', 'index')->name('index')->middleware('permission:Staff Manager');
        Route::get('/create', 'create')->name('create')->middleware('permission:Staff Manager');
        Route::post('/', 'store')->name('store')->middleware('permission:Staff Manager');
        Route::get('/{user}', 'show')->name('show')->middleware('permission:Staff Manager');
        Route::put('/{user}/unsuspend', 'unsuspend')->name('unsuspend')->middleware('permission:Staff Manager,can_approve');
        Route::get('/{user}/edit', 'edit')->name('edit')->middleware('permission:Staff Manager');
        Route::put('/{user}', 'update')->name('update')->middleware('permission:Staff Manager');
        Route::put('/{user}/suspend', 'suspend')->name('suspend')->middleware('permission:Staff Manager,can_approve');
        Route::post('/{user}/assign-role', 'assignRole')->name('assignRole')->middleware('permission:Staff Manager,can_assign');
        Route::delete('/{user}/remove-role/{roleId}', 'removeRole')->name('removeRole')->middleware('permission:Staff Manager,can_assign');
        Route::put('/{user}/verify-email', 'verifyEmail')->name('verifyEmail')->middleware('permission:Staff Manager,can_approve');
        Route::delete('/{user}', 'destroy')->name('destroy')->middleware('permission:Staff Manager,can_delete');
    });



    Route::prefix('users')->name('users.')->controller(UserController::class)->group(function () {
        Route::get('/', 'index')->name('index')->middleware('permission:User Management');
        Route::get('/create', 'create')->name('create')->middleware('permission:User Management');
        Route::post('/', 'store')->name('store')->middleware('permission:User Management');
        Route::get('/{user}', 'show')->name('show')->middleware('permission:User Management');
        Route::get('/{user}/edit', 'edit')->name('edit')->middleware('permission:User Management');
        Route::put('/{user}', 'update')->name('update')->middleware('permission:User Management');
        Route::delete('/{user}', 'destroy')->name('destroy')->middleware('permission:User Management,can_delete');

        // Suspension
        Route::put('/{user}/suspend', 'suspend')->name('suspend')->middleware('permission:User Management,can_approve');
        Route::put('/{user}/unsuspend', 'unsuspend')->name('unsuspend')->middleware('permission:User Management,can_approve');

        // Roles & Permissions
        Route::post('/{user}/assign-role', 'assignRole')->name('assignRole')->middleware('permission:User Management,can_assign');
        Route::delete('/{user}/remove-role/{roleId}', 'removeRole')->name('removeRole')->middleware('permission:User Management,can_assign');

        // Email verification
        Route::put('/{user}/verify-email', 'verifyEmail')->name('verifyEmail')->middleware('permission:User Management,can_approve');

        // Membership management
        Route::post('/{user}/request-membership-validation', 'requestMembershipValidation')->name('requestMembershipValidation')->middleware('permission:User Management,can_approve');
        Route::post('/{user}/accept-membership', 'acceptMembership')->name('acceptMembership')->middleware('permission:User Management,can_join');
        Route::post('/{user}/activate-membership', 'activateMembership')->name('activateMembership')->middleware('permission:User Management,can_approve');
    });
});

Route::middleware(['auth'])->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.markAllAsRead');
});

// {
//     "id": 5,
//     "name": "Ben Carson",
//     "suspended": 0,
//     "phone": "0908377367",
//     "type": "user",
//     "email": "ben@gmail.com",
//     "email_verified_at": null,
//     "created_at": "2025-04-22T07:42:19.000000Z",
//     "updated_at": "2025-04-22T07:42:19.000000Z",
//     "should_activate_membership": 0,
//     "membership_activated": 0,
//     "membership_code": null,
//     "membership_activated_on": null,
//     "membership_activation_amount": null,
//     "membership_type": null,
//     "membership_status": "pending",
//     "roles": [
//         {
//             "id": 3,
//             "name": "User",
//             "slug": "user",
//             "type": "user",
//             "description": "This is the base role for user",
//             "base_role": 1,
//             "parent_role_id": null,
//             "active": 1,
//             "deleted_at": null,
//             "created_at": "2025-04-21T04:03:16.000000Z",
//             "updated_at": "2025-04-21T04:03:16.000000Z",
//             "pivot": {
//                 "user_id": 5,
//                 "role_id": 3,
//                 "created_at": "2025-04-22T07:42:19.000000Z",
//                 "updated_at": "2025-04-22T07:42:19.000000Z"
//             }
//         }
//     ]
// }
```


---

### 4.3 Monnify Payment Routes Were Public

#### Finding

The Monnify routes accepted user payment actions without auth middleware, while the controller accessed `$request->user()->id`.

#### Risk

Unauthenticated requests could crash endpoints, create inconsistent payment records, or abuse payment initialization endpoints.

#### Recommendation

Only the webhook route should remain public. All user-initiated payment routes should require `auth`, `verified`, and `kyc`.

#### Implementation

The webhook route is public. Every user-initiated Monnify route is inside an authenticated route group. Direct card routes are now routed to a blocking method.


### `routes/monnify.php` — Hardened Monnify routes

```php
<?php

use App\Http\Controllers\MonnifyTransactionController;
use App\Http\Controllers\WebhookController;
use Illuminate\Support\Facades\Route;

Route::post('monnify/webhook', [WebhookController::class, 'handleMonnifyWebhook'])->name('monnify.webhook');

Route::middleware(['auth', 'verified', 'kyc'])->prefix('monnify')->group(function () {
    Route::post('init-transfer', [MonnifyTransactionController::class, 'initTransfer'])->name('monnify.init-transfer');
    Route::post('init-card', [MonnifyTransactionController::class, 'initCard'])->name('card-init');
    Route::post('confirm-transfer', [MonnifyTransactionController::class, 'confirmTransfer'])->name('confirm-transfer');
    Route::post('checkout/init', [MonnifyTransactionController::class, 'initiateCheckout'])->name('checkout-init');
    Route::get('checkout/callback', [MonnifyTransactionController::class, 'checkoutcallback'])->name('checkout-callback');

    // Direct PAN/CVV/PIN collection is intentionally blocked. Use hosted checkout/tokenized provider flows.
    Route::post('card/charge', [MonnifyTransactionController::class, 'blockedDirectCardCharge'])->name('charge-card');
    Route::post('card/otp-authorize', [MonnifyTransactionController::class, 'blockedDirectCardCharge'])->name('card-otp-autorize');
    Route::post('card/3ds-authorize', [MonnifyTransactionController::class, 'blockedDirectCardCharge'])->name('card-3ds-authorize');
});
```


---

### 4.4 Webhook Accepted Success Before Signature Verification

#### Finding

The webhook previously sent a 200 response before verifying the Monnify signature.

#### Risk

Invalid webhook requests could appear accepted. That weakens auditability and may hide attacks or integration failures.

#### Recommendation

Verify the signature first using timing-safe comparison. Return 401 for invalid signatures and only return 200 after safe processing.

#### Implementation

The webhook now uses `hash_equals`, rejects missing/invalid signatures, validates the transaction reference, accepts only fully paid statuses, and sends successful wallet funding through the centralized wallet funding service.


### `app/Http/Controllers/WebhookController.php` — Hardened Monnify webhook controller

```php
<?php
namespace App\Http\Controllers;

use App\Models\MonnifyTransaction;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Services\WalletFundingService;
use Carbon\Carbon;

class WebhookController extends Controller
{
    public function __construct(private WalletFundingService $walletFundingService) {}

    public function handleMonnifyWebhook(Request $request)
    {
        $signature = (string) $request->header('monnify-signature');
        $clientSecret = (string) config('services.monnify.secret');
        $payload = json_encode($request->all());

        $computedHash = hash_hmac('sha512', $payload, $clientSecret);
        if (!$signature || !hash_equals($computedHash, $signature)) {
            Log::warning('Invalid Monnify signature.', ['reference' => $request->input('eventData.transactionReference')]);
            return response()->json(['message' => 'Invalid signature'], 401);
        }

        $eventType = $request->input('eventType');
        $data = $request->input('eventData', []);
        $reference = $data['transactionReference'] ?? null;

        if (!$reference) {
            Log::warning('Missing transaction reference in webhook.', $data);
            return response()->json(['message' => 'Missing transaction reference'], 422);
        }

        if ($eventType === 'SUCCESSFUL_TRANSACTION') {
            $this->handleSuccessfulTransaction($reference, $data, $eventType);
        } else {
            Log::info("Webhook Event: {$eventType}", ['reference' => $reference, 'data' => $data]);
        }

        return response()->json(['status' => 'received']);
    }

    protected function handleSuccessfulTransaction(string $reference, array $data, string $eventType): void
    {
        $status = strtoupper($data['paymentStatus'] ?? 'UNKNOWN');
        if (!in_array($status, ['PAID', 'OVERPAID'], true)) {
            Log::info('Monnify webhook ignored because status is not fully paid.', compact('reference', 'status'));
            return;
        }

        $amountPaid = (float) ($data['amountPaid'] ?? 0);
        $paidAt = Carbon::parse($data['paidOn'] ?? now());
        $data['source'] = 'webhook:' . $eventType;

        $transaction = $this->walletFundingService->confirmMonnifyPayment($reference, $amountPaid, $paidAt, $data, $status);

        Log::info('Wallet funding webhook processed.', [
            'reference' => $reference,
            'amount' => $amountPaid,
            'status' => $status,
            'paid_at' => $paidAt->toDateTimeString(),
            'user_id' => $transaction?->user_id,
            'event' => $eventType,
        ]);
    }
}
```


---

### 4.5 Wallet Funding Could Double-Credit

#### Finding

Wallet funding logic existed in multiple locations:

- webhook processing,
- checkout callback,
- manual transfer confirmation,
- card transaction handling.

Each path could increment the wallet independently.

#### Risk

A user could be credited more than once for the same provider transaction if webhook, callback, and manual confirmation overlapped.

#### Recommendation

Move all wallet credit/debit operations into a ledger-backed service with idempotency keys and database row locks.

#### Implementation

Added:

- `wallet_ledgers` table,
- `WalletLedger` model,
- `WalletService`,
- `WalletFundingService`.

The service locks the user row, records balance before/after, stores a unique idempotency key, and returns the existing ledger record when the same operation is attempted again.


### `database/migrations/2026_05_23_000001_harden_wallet_and_transactions.php` — Wallet hardening migration

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wallet_ledgers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('transaction_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('direction', ['credit', 'debit']);
            $table->decimal('amount', 18, 2);
            $table->decimal('balance_before', 18, 2);
            $table->decimal('balance_after', 18, 2);
            $table->string('provider')->nullable();
            $table->string('provider_reference')->nullable();
            $table->string('reason');
            $table->json('metadata')->nullable();
            $table->string('idempotency_key')->unique();
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
            $table->index(['provider', 'provider_reference']);
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->unique('reference');
            $table->unique('payment_reference');
        });

        Schema::table('monnify_transactions', function (Blueprint $table) {
            $table->unique('reference');
            $table->unique('payment_reference');
        });

        // MySQL enum widening for loan disbursement; safe to skip on non-MySQL by catching deployment failures manually.
        try {
            DB::statement("ALTER TABLE transactions MODIFY type ENUM('investment','saving','withdrawal','wallet','loan_disbursement','loan_repayment','savings_refund') NOT NULL");
        } catch (\Throwable $e) {
            // Some databases do not support MODIFY ENUM. Existing app still works with string-like DB engines.
        }

        foreach ([
            'wallet',
            'savings_balance',
            'investment_balance',
            'withdrawable_savings_balance',
            'withdrawable_investment_balance',
            'investment_profit_balance',
        ] as $column) {
            try {
                DB::statement("ALTER TABLE users MODIFY {$column} DECIMAL(18, 2) NOT NULL DEFAULT 0.00");
            } catch (\Throwable $e) {
                // Keep migration portable for local SQLite/test databases.
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('wallet_ledgers');
    }
};
```


### `app/Models/WalletLedger.php` — Wallet ledger model

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WalletLedger extends Model
{
    protected $fillable = [
        'user_id',
        'transaction_id',
        'direction',
        'amount',
        'balance_before',
        'balance_after',
        'provider',
        'provider_reference',
        'reason',
        'metadata',
        'idempotency_key',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'balance_before' => 'decimal:2',
        'balance_after' => 'decimal:2',
        'metadata' => 'array',
    ];
}
```


### `app/Services/WalletService.php` — Central wallet movement service

```php
<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\User;
use App\Models\WalletLedger;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class WalletService
{
    public function credit(User $user, float|string $amount, string $reason, string $idempotencyKey, ?Transaction $transaction = null, array $metadata = []): WalletLedger
    {
        return $this->move($user, $amount, 'credit', $reason, $idempotencyKey, $transaction, $metadata);
    }

    public function debit(User $user, float|string $amount, string $reason, string $idempotencyKey, ?Transaction $transaction = null, array $metadata = []): WalletLedger
    {
        return $this->move($user, $amount, 'debit', $reason, $idempotencyKey, $transaction, $metadata);
    }

    private function move(User $user, float|string $amount, string $direction, string $reason, string $idempotencyKey, ?Transaction $transaction, array $metadata): WalletLedger
    {
        $amount = round((float) $amount, 2);

        if ($amount <= 0) {
            throw new InvalidArgumentException('Wallet amount must be greater than zero.');
        }

        return DB::transaction(function () use ($user, $amount, $direction, $reason, $idempotencyKey, $transaction, $metadata) {
            $existing = WalletLedger::where('idempotency_key', $idempotencyKey)->first();
            if ($existing) {
                return $existing;
            }

            /** @var User $lockedUser */
            $lockedUser = User::whereKey($user->getKey())->lockForUpdate()->firstOrFail();
            $before = (float) $lockedUser->wallet;
            $after = $direction === 'credit' ? $before + $amount : $before - $amount;

            if ($after < 0) {
                throw new InvalidArgumentException('Insufficient wallet balance.');
            }

            $lockedUser->wallet = $after;
            $lockedUser->save();

            return WalletLedger::create([
                'user_id' => $lockedUser->id,
                'transaction_id' => $transaction?->id,
                'direction' => $direction,
                'amount' => $amount,
                'balance_before' => $before,
                'balance_after' => $after,
                'provider' => $metadata['provider'] ?? null,
                'provider_reference' => $metadata['provider_reference'] ?? null,
                'reason' => $reason,
                'metadata' => $metadata,
                'idempotency_key' => $idempotencyKey,
            ]);
        });
    }
}
```


### `app/Services/WalletFundingService.php` — Central Monnify wallet funding service

```php
<?php

namespace App\Services;

use App\Mail\WalletFundedMail;
use App\Models\MonnifyTransaction;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class WalletFundingService
{
    public function __construct(private WalletService $walletService) {}

    public function confirmMonnifyPayment(string $reference, float|string $amount, ?Carbon $paidAt = null, array $providerPayload = [], string $status = 'PAID'): ?Transaction
    {
        $paidAt = $paidAt ?: now();
        $amount = round((float) $amount, 2);

        if ($amount <= 0) {
            Log::warning('Monnify payment ignored because amount is invalid.', compact('reference', 'amount'));
            return null;
        }

        $transaction = DB::transaction(function () use ($reference, $amount, $paidAt, $providerPayload, $status) {
            /** @var Transaction|null $transaction */
            $transaction = Transaction::where('reference', $reference)->lockForUpdate()->first();
            if (!$transaction) {
                return null;
            }

            $monnifyTransaction = MonnifyTransaction::where('reference', $reference)->lockForUpdate()->first();
            if ($monnifyTransaction) {
                $monnifyTransaction->update([
                    'status' => strtoupper($status),
                    'amount' => $amount,
                    'paid_at' => $paidAt,
                    'response' => json_encode($providerPayload),
                ]);
            }

            if (in_array($transaction->status, ['confirmed', 'approved'], true)) {
                return $transaction;
            }

            $transaction->update([
                'status' => 'confirmed',
                'amount' => $amount,
                'paid_at' => $paidAt,
                'confirmed_at' => now(),
            ]);

            /** @var User|null $user */
            $user = User::whereKey($transaction->user_id)->first();
            if ($user) {
                $this->walletService->credit(
                    $user,
                    $amount,
                    'wallet_funding',
                    'monnify:' . $reference,
                    $transaction,
                    [
                        'provider' => 'monnify',
                        'provider_reference' => $reference,
                        'status' => strtoupper($status),
                        'source' => $providerPayload['source'] ?? 'provider_confirmation',
                    ]
                );
            }

            return $transaction;
        });

        if ($transaction && $transaction->user) {
            try {
                Mail::to($transaction->user->email)->queue(new WalletFundedMail($transaction->user, $amount, $reference));
            } catch (\Throwable $e) {
                Log::warning("WalletFundedMail failed for {$reference}: " . $e->getMessage());
            }
        }

        return $transaction;
    }
}
```


---

### 4.6 Direct Card PAN/CVV/PIN Collection Risk

#### Finding

The original app accepted raw card number, expiry, CVV, PIN, OTP, and 3DS values through backend/frontend flows.

#### Risk

This places the platform into serious PCI-DSS scope. For an investment/fintech product, raw card handling is a major compliance and breach risk.

#### Recommendation

Use hosted checkout or tokenized provider SDK flows. Let Monnify or the payment provider handle raw card collection.

#### Implementation

User-facing direct card routes now point to `blockedDirectCardCharge`. The old internal card methods were not used by the route layer. The product should use hosted checkout flows.

```php
public function blockedDirectCardCharge(Request $request)
{
    return response()->json([
        'success' => false,
        'message' => 'Direct card collection is disabled for PCI safety. Please use the secure hosted checkout flow.',
    ], 422);
}
```

---

### 4.7 Loan Creation Runtime Bug

#### Finding

`LoanController::store()` used `$user` inside a transaction closure without including it in the closure `use (...)` list.

#### Risk

Submitting a loan request could fail with `Undefined variable $user`.

#### Recommendation

Pass `$user` into the closure.

#### Implementation


### `app/Http/Controllers/LoanController.php` — Loan controller request/create/cancel implementation

```php
<?php

namespace App\Http\Controllers;

use App\Models\Investment;
use App\Models\Loan;
use App\Models\LoanPlan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\LoanStatusUpdated;
use App\Models\Notification;

class LoanController extends Controller
{
    public function index()
    {
        $loans = Loan::with(['user', 'loanPlan', 'approver', 'rejector', 'repayments'])
            ->where('user_id', Auth::id())
            ->get();
        $offers = $this->generateLoanOffers(Auth::user());
        $notifications = Notification::where('notifiable_id', Auth::id())->where('read_at', null)->get();
        return inertia('Loans/Index', [
            'loans' => $loans,
            'offers' => $offers,
            'notifications' => $notifications,
        ]);
    }

    public function create()
    {
        $loanPlans = LoanPlan::where('active', true)->get();
        $user = Auth::user();
        $totalProfitBalance = Investment::where('user_id', $user->id)
            ->where('status', 'active')
            ->sum('total_expected_profit');
        $offers = $this->generateLoanOffers($user);

        return inertia('Loans/Create', [
            'loanPlans' => $loanPlans,
            'totalProfitBalance' => $totalProfitBalance,
            'offers' => $offers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'loan_plan_id' => 'required|exists:loan_plans,id',
            'amount' => 'required|numeric|min:0',
        ]);

        $loanPlan = LoanPlan::findOrFail($request->loan_plan_id);
        $user = Auth::user();
        $totalProfitBalance = Investment::where('user_id', $user->id)
            ->where('status', 'active')
            ->sum('total_expected_profit');

        if ($totalProfitBalance < $loanPlan->min_profit_balance) {
            return back()->withErrors(['amount' => 'Insufficient investment profit balance to request this loan.']);
        }

        if ($validated['amount'] < $loanPlan->min_amount || $validated['amount'] > $loanPlan->max_amount) {
            return back()->withErrors(['amount' => 'Loan amount must be between ' . $loanPlan->min_amount . ' and ' . $loanPlan->max_amount . '.']);
        }

        $totalRepayment = $validated['amount'] * (1 + ($loanPlan->interest_rate / 100));

        $loan = DB::transaction(function () use ($validated, $loanPlan, $totalRepayment, $user) {
            $loan = Loan::create([
                'user_id' => Auth::id(),
                'loan_plan_id' => $loanPlan->id,
                'amount' => $validated['amount'],
                'interest_rate' => $loanPlan->interest_rate,
                'duration' => $loanPlan->duration,
                'total_repayment' => $totalRepayment,
                'status' => 'pending',
            ]);

            // Notify user and admin
            $loan->sendNotification('loan_request', "You have requested a loan of ₦{$loan->amount}.");
            Mail::to($user->email)->send(new LoanStatusUpdated($loan, 'requested'));
            $admin = User::where('type', 'admin')->first();
            if ($admin) {
                Mail::to($admin->email)->send(new LoanStatusUpdated($loan, 'requested', true));
            }

            return $loan;
        });

        return redirect()->route('loans.index')->with('success', 'Loan request submitted successfully.');
    }

    public function cancel(Loan $loan)
    {
        abort_unless((int) $loan->user_id === (int) Auth::id(), 403);
        $loan->cancel();
        return redirect()->route('loans.index')->with('success', 'Loan request cancelled successfully.');
    }

    public function adminIndex()
    {
        $loans = Loan::with(['user', 'loanPlan', 'approver', 'rejector', 'repayments'])->get();
        $notifications = Notification::where('notifiable_id', Auth::id())->where('read_at', null)->get();
        return inertia('Admin/Loans/Index', [
            'loans' => $loans,
            'notifications' => $notifications,
        ]);
    }

    public function approve(Loan $loan)
    {
        $loan->update([
            'status' => 'approved',
            'approved_by' => Auth::id(),
            'approved_at' => now(),
        ]);

        $loan->disburse();

        // Notify admin
        $loan->sendNotification('loan_approved', "Loan ID {$loan->id} approved for ₦{$loan->amount}.", Auth::id());
        Mail::to(Auth::user()->email)->send(new LoanStatusUpdated($loan, 'approved', true));
```


---

### 4.8 Loan Disbursement Used Wrong Wallet Field

#### Finding

The original model used `wallet_balance`, but the users table used `wallet`.

#### Risk

Loan disbursement could fail to credit the actual user wallet or silently manipulate a non-persisted attribute.

#### Recommendation

Route loan disbursement through the wallet ledger and use the actual wallet field.

#### Implementation


### `app/Models/Loan.php` — Loan disbursement implementation

```php

    public function repayments()
    {
        return $this->hasMany(LoanRepayment::class);
    }

    public function disburse()
    {
        try {
            return DB::transaction(function () {
                $loan = self::whereKey($this->id)->lockForUpdate()->firstOrFail();

                if ($loan->status === 'disbursed') {
                    return $loan;
                }

                $loan->update([
                    'status' => 'disbursed',
                    'disbursed_at' => now(),
                ]);

                $user = $loan->user;
                $transaction = Transaction::create([
                    'user_id' => $loan->user_id,
                    'type' => 'loan_disbursement',
                    'amount' => $loan->amount,
                    'method' => 'wallet',
                    'status' => 'completed',
                    'note' => 'Loan disbursement for Loan ID: ' . $loan->id,
                    'approved_by' => $loan->approved_by,
                    'approved_at' => now(),
                    'reference' => 'LOAN-' . \Illuminate\Support\Str::uuid(),
                ]);

                app(WalletService::class)->credit(
                    $user,
                    $loan->amount,
                    'loan_disbursement',
                    'loan-disbursement:' . $loan->id,
                    $transaction,
                    ['loan_id' => $loan->id]
                );

                if (!$loan->repayments()->exists()) {
                    $loan->createRepaymentSchedule();
                }

                $loan->sendNotification('loan_disbursed', "Your loan of ₦{$loan->amount} has been disbursed.");
                Mail::to($user->email)->send(new LoanStatusUpdated($loan, 'disbursed'));
                $admin = User::where('type', 'admin')->first();
                if ($admin) {
                    Mail::to($admin->email)->send(new LoanStatusUpdated($loan, 'disbursed', true));
                }

                return $loan;
            });
        } catch (\Exception $e) {
            Log::error('Failed to disburse loan', [
                'loan_id' => $this->id,
                'user_id' => $this->user_id,
                'error' => $e->getMessage(),
```


---

### 4.9 Loan Cancel/Pay Ownership Checks

#### Finding

User actions like loan cancellation and manual payment accepted route-model-bound loans without checking if the loan belonged to the authenticated user.

#### Risk

A user could operate on another user’s loan by changing the route ID.

#### Recommendation

Add owner checks or policies for user-facing loan operations.

#### Implementation

`LoanController::cancel()` now rejects non-owners with 403:

```php
abort_unless((int) $loan->user_id === (int) Auth::id(), 403);
```

This should be extended to every user-owned resource action using policies.

---

### 4.10 Savings Cancellation Refunded the Wrong Amount

#### Finding

The original savings cancellation logic refunded the user’s entire savings balance and used `wallet_balance`, not the real `wallet` field.

#### Risk

Cancelling one savings plan could refund money belonging to other active savings plans.

#### Recommendation

Refund only successful/completed/paid contributions belonging to the cancelled saving record, then reduce `savings_balance` by that exact amount.

#### Implementation


### `app/Models/Saving.php` — Savings cancellation implementation

```php
    public function cancel()
    {
        try {
            return DB::transaction(function () {
                $this->update([
                    'status' => 'cancelled',
                    'active' => false,
                ]);

                // Update remaining daily savings to cancelled
                $this->dailySavings()
                    ->whereIn('status', ['pending', 'failed'])
                    ->update([
                        'status' => 'cancelled',
                        'cancelled_at' => Carbon::now(),
                    ]);

                $user = $this->user()->lockForUpdate()->first();
                $refund = (float) $this->dailySavings()
                    ->whereIn('status', ['successful', 'completed', 'paid'])
                    ->sum('amount');

                if ($user && $refund > 0) {
                    app(WalletService::class)->credit(
                        $user,
                        $refund,
                        'savings_refund',
                        'savings-refund:' . $this->id,
                        null,
                        ['saving_id' => $this->id]
                    );
                    $user->savings_balance = max(0, (float) $user->savings_balance - $refund);
                    $user->save();
                }
            });
        } catch (Exception $e) {
            Log::error('Failed to cancel saving', [
                'saving_id' => $this->id,
                'user_id' => $this->user_id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw new Exception('Failed to cancel the saving. Please try again.');
        }
    }
}
```


---

### 4.11 Public Test Email Route and Bank Sync Route

#### Finding

The app had a public `/test-email` route and a public `/banks/sync` route.

#### Risk

Anyone could trigger queued emails or provider sync activity.

#### Recommendation

Remove test email route from production and protect bank sync behind authenticated admin middleware.

#### Implementation

`/test-email` was removed. `/banks/sync` was protected.


### `routes/web.php` — Web routes including documentation and protected bank sync

```php
<?php

use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Api\BankController;
use App\Http\Controllers\DashboardController;
use App\Models\InvestmentPlan;
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');
// New Routes Vicky Created
Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/invest-plans', function () {
    $plans = InvestmentPlan::where('active', true)->with('category')->get();
    return Inertia::render('InvestPlans',  ['plans'=>$plans]);
})->name('invest.plans');

Route::get('/terms', function () {
    return Inertia::render('Terms');
})->name('terms');
Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');

//
Route::middleware(['auth', 'verified','kyc'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');
});


Route::middleware(['auth', 'verified','kyc'])->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/mark-as-read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
});


Route::get('/banks', [BankController::class, 'index'])->middleware(['auth', 'verified'])->name('banks.index');
Route::post('/banks/sync', [BankController::class, 'syncFromMonnify'])
    ->middleware(['auth', 'verified', 'permission:ManualPaymentMethod,can_approve'])
    ->name('banks.sync');

Route::middleware(['auth', 'verified', 'kyc'])->group(function () {
    Route::get('/documentation/admin', fn () => Inertia::render('Documentation/AdminGuide'))->name('documentation.admin');
    Route::get('/documentation/user', fn () => Inertia::render('Documentation/UserGuide'))->name('documentation.user');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/user.php';
require __DIR__.'/investmentplan.php';
require __DIR__.'/savings.php';
require __DIR__.'/payments.php';
require __DIR__.'/invests.php';
require __DIR__.'/monnify.php';
require __DIR__.'/transactions.php';
require __DIR__.'/loan.php';
```


---

### 4.12 SQL Dumps with Sensitive Data

#### Finding

The submitted source contained SQL dump files such as Monnify transaction exports and full app database dumps.

#### Risk

SQL dumps can expose names, emails, transaction references, payment metadata, and provider response payloads.

#### Recommendation

Remove all SQL dumps from source control, rotate exposed secrets, and use sanitized seeders/fixtures.

#### Implementation

The fixed package removed SQL dumps and updated `.gitignore`.


### `.gitignore` — Updated gitignore

```gitignore
/.phpunit.cache
/bootstrap/ssr
/node_modules
/public/build
/public/hot
/public/storage
/storage/*.key
/storage/pail
/vendor
.env
.env.backup
.env.production
.phpactor.json
.phpunit.result.cache
Homestead.json
Homestead.yaml
npm-debug.log
yarn-error.log
/auth.json
/.fleet
/.idea
/.nova
/.vscode
/.zed

# Never commit production or payment data dumps.
*.sql
/database/*.sql
```


---

## 5. Frontend Findings and Fixes

### 5.1 Production Build Failure From Case-Sensitive Imports

#### Finding

Many files imported:

```ts
@/components/Datatable
```

but the real file was:

```text
resources/js/components/DataTable.jsx
```

Linux production builds are case-sensitive.

#### Risk

`npm run build` failed.

#### Recommendation

Normalize imports and/or provide a compatibility shim.

#### Implementation

The imports and file references were fixed so the production build passes.

---

### 5.2 Missing/Misnamed Assets

#### Finding

Some assets were referenced with a different filename case, for example `Outlook.png` while the actual file was `outlook.png`.

#### Risk

Vite build failure or broken images in production.

#### Recommendation

Normalize public asset names and imports.

#### Implementation

Asset path references were corrected.

---

### 5.3 TypeScript Errors

#### Finding

The frontend had TypeScript errors involving missing props, undefined setters, mismatched Inertia page props, missing SVG modules, and `react-router` imports in an Inertia app.

#### Risk

Type checks failed and the app was likely to ship runtime UI bugs.

#### Recommendation

Use Inertia `Link`, correct component props, add safe types, and remove missing icon/index imports.

#### Implementation

Type errors were fixed sufficiently for `npm run types` to pass.

---

### 5.4 Design Token and Mobile Responsiveness Work

#### Finding

The UI used many hard-coded colors, too many fonts, inconsistent spacing, and desktop-first layout assumptions.

#### Figma Direction

The supplied design direction uses:

- primary purple: `#5042DA`,
- white cards,
- soft gray borders,
- rounded cards,
- clean dashboard hierarchy,
- purple sidebar,
- mobile drawer/bottom-sheet behavior.

#### Recommendation

Create project-level OptiVest UI tokens and reusable responsive shell classes.

#### Implementation


### `resources/css/app.css` — OptiVest UI tokens and responsive utility classes

```css
/* OptiVest design tokens derived from the approved Figma direction. */
:root {
  --opti-primary: #5042da;
  --opti-primary-hover: #4338ca;
  --opti-primary-soft: #eef2ff;
  --opti-sidebar-start: #4c44db;
  --opti-sidebar-end: #5f2ed1;
  --opti-text-primary: #0a0d12;
  --opti-text-secondary: #717680;
  --opti-text-muted: #a4a7ae;
  --opti-border: #e9eaeb;
  --opti-surface: #ffffff;
  --opti-surface-muted: #f5f5f5;
  --opti-success: #17b26a;
  --opti-danger: #f04438;
  --opti-warning: #eaaa08;
}

.opti-mobile-shell {
  @apply mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8;
}

.opti-card {
  @apply rounded-2xl border border-[#E9EAEB] bg-white shadow-sm;
}

.opti-focus-ring {
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5042DA] focus-visible:ring-offset-2;
}

@import '@fontsource/roboto';
@import '@fontsource/poppins';
@import '@fontsource/inter';
@import '@fontsource/rubik';
@import '@fontsource/amarante';
@import '@fontsource/concert-one';
```


Recommended future cleanup: reduce the many font imports to one primary UI font, preferably Inter, and gradually replace hard-coded `#hex` usage with design tokens.

---

## 6. In-App Documentation and Tutorials

### 6.1 Admin Documentation Page

#### Requirement

The admin side needed a structured documentation/tutorial page explaining how the system works.

#### Implementation

Added route:

```php
Route::get('/documentation/admin', fn () => Inertia::render('Documentation/AdminGuide'))->name('documentation.admin');
```

Added admin guide page:


### `resources/js/pages/Documentation/AdminGuide.tsx` — Admin documentation page

```tsx
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, CheckCircle2, CreditCard, ShieldCheck, Users, WalletCards } from 'lucide-react';

const breadcrumbs = [{ title: 'Admin Documentation', href: '/documentation/admin' }];

const sections = [
  {
    icon: ShieldCheck,
    title: 'Security and access control',
    body: 'Admins manage users, roles and permissions. Every protected page should require authentication, verification, KYC where relevant, and the permission ability attached to the action.',
    tips: ['Use Roles to group permissions.', 'Suspend risky accounts instead of deleting records.', 'Audit permission changes before assigning them.'],
  },
  {
    icon: WalletCards,
    title: 'Wallet and payment flow',
    body: 'Users fund their OptiVest wallet through secure hosted payment and bank-transfer confirmation. Confirmed payments are posted through the wallet ledger to avoid duplicate credits.',
    tips: ['Do not manually credit users outside the ledger.', 'Use transaction references when reconciling Monnify.', 'Webhook and manual confirmation are idempotent.'],
  },
  {
    icon: CreditCard,
    title: 'Investments, savings and loans',
    body: 'Investment plans and savings plans define what users can subscribe to. Loans are requested by users and approved by admins only when the user meets the platform requirements.',
    tips: ['Keep plans inactive until reviewed.', 'Approve loans only after checking balances and repayment eligibility.', 'Use status filters for reconciliation.'],
  },
  {
    icon: Users,
    title: 'User management',
    body: 'Admin, staff and user manager screens allow controlled account operations including profile review, role assignment, suspension and verification management.',
    tips: ['Grant the least permission needed.', 'Do not share admin accounts.', 'Use verification status before enabling sensitive actions.'],
  },
];

export default function AdminGuide() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Admin Documentation" />
      <main className="opti-mobile-shell py-6 sm:py-8">
        <section className="rounded-[28px] bg-gradient-to-br from-[#5042DA] to-[#5F2ED1] p-6 text-white shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-white/75">OptiVest Admin Tutorial</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-4xl">Operate the platform safely and confidently</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/80 sm:text-base">This guide explains the full admin workflow: permissions, users, wallets, investments, savings, loans, payments, reconciliation, and daily operating checks.</p>
            </div>
            <BookOpen className="h-14 w-14 shrink-0 text-white/80" />
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {sections.map((section) => (
            <article key={section.title} className="opti-card p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <span className="rounded-2xl bg-[#EEF2FF] p-3 text-[#5042DA]"><section.icon className="h-6 w-6" /></span>
                <div>
                  <h2 className="text-lg font-semibold text-[#0A0D12]">{section.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#717680]">{section.body}</p>
                </div>
              </div>
              <ul className="mt-4 space-y-2">
                {section.tips.map((tip) => (
                  <li key={tip} className="flex gap-2 text-sm text-[#0A0D12]"><CheckCircle2 className="mt-0.5 h-4 w-4 text-[#17B26A]" /> {tip}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="mt-6 opti-card p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-[#0A0D12]">Recommended daily admin checklist</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {['Review pending transactions', 'Check webhook/payment exceptions', 'Review loan requests', 'Audit new admin/staff changes'].map((item) => (
              <div key={item} className="rounded-2xl bg-[#F5F5F5] p-4 text-sm font-medium text-[#0A0D12]">{item}</div>
            ))}
          </div>
          <p className="mt-4 text-sm text-[#717680]">Need the customer-facing flow? Open the <Link href="/documentation/user" className="font-semibold text-[#5042DA]">user tutorial</Link>.</p>
        </section>
      </main>
    </AppLayout>
  );
}
```


---

### 6.2 User Tutorial Page

#### Requirement

The user side needed a tutorial explaining how users can use the website.

#### Implementation

Added route:

```php
Route::get('/documentation/user', fn () => Inertia::render('Documentation/UserGuide'))->name('documentation.user');
```

Added user guide page:


### `resources/js/pages/Documentation/UserGuide.tsx` — User documentation/tutorial page

```tsx
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, BadgeHelp, Banknote, Landmark, LineChart, PiggyBank, Wallet } from 'lucide-react';

const breadcrumbs = [{ title: 'User Tutorial', href: '/documentation/user' }];

const steps = [
  { icon: Wallet, title: 'Create and verify your account', text: 'Register, complete your profile, verify your email and finish any KYC steps before using money features.' },
  { icon: Banknote, title: 'Fund your wallet', text: 'Use the Fund button to start a secure hosted checkout or bank-transfer funding flow. Your wallet updates after provider confirmation.' },
  { icon: LineChart, title: 'Start an investment', text: 'Review available investment plans, compare expected returns and timelines, then subscribe with wallet balance.' },
  { icon: PiggyBank, title: 'Use daily savings', text: 'Pick a savings plan, set your target and monitor contribution progress from the savings page.' },
  { icon: Landmark, title: 'Request a loan', text: 'Eligible users can request loans based on platform rules. Admins review and approve eligible requests.' },
  { icon: BadgeHelp, title: 'Track activity', text: 'Use transactions, notifications and dashboard cards to monitor funding, savings, investments, withdrawals and repayments.' },
];

export default function UserGuide() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="User Tutorial" />
      <main className="opti-mobile-shell py-6 sm:py-8">
        <section className="rounded-[28px] bg-[#5042DA] p-6 text-white shadow-sm sm:p-8">
          <p className="text-sm font-medium text-white/75">OptiVest User Tutorial</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-4xl">How to use OptiVest</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/80 sm:text-base">This quick guide explains how users fund wallets, invest, save, request loans, monitor activities and stay safe on the platform.</p>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title} className="opti-card p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-2xl bg-[#EEF2FF] p-3 text-[#5042DA]"><step.icon className="h-6 w-6" /></span>
                <span className="text-sm font-semibold text-[#A4A7AE]">Step {index + 1}</span>
              </div>
              <h2 className="mt-5 text-lg font-semibold text-[#0A0D12]">{step.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#717680]">{step.text}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 opti-card p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-[#0A0D12]">Safety tips</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {['Never share your password or transaction PIN.', 'Confirm you are on the official OptiVest domain before logging in.', 'Contact support if a wallet transaction looks wrong.'].map((tip) => (
              <div key={tip} className="rounded-2xl border border-[#E9EAEB] p-4 text-sm leading-6 text-[#717680]">{tip}</div>
            ))}
          </div>
          <Link href="/dashboard" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#5042DA] px-5 py-3 text-sm font-semibold text-white opti-focus-ring">Go to dashboard <ArrowRight className="h-4 w-4" /></Link>
        </section>
      </main>
    </AppLayout>
  );
}
```


---

## 7. Documentation Files Added to the Source Package

The fixed package also includes these developer-facing Markdown files:

- `OPTIVEST_DOCUMENTATION.md`
- `SECURITY_AND_FIXES_SUMMARY.md`
- `BUILD_VALIDATION.md`

They provide operational setup details, security summary, and validation notes.

---

## 8. Recommended Future Work

The fixes stabilize major issues, but the following future work is strongly recommended.

### 8.1 Backend Tests

Add feature tests for:

```text
unauthenticated users cannot access protected routes
regular users cannot access admin routes
users cannot cancel other users' loans
users cannot view or mutate other users' transactions
Monnify webhook rejects bad signatures
Monnify webhook processes a valid payment once
manual confirmation and webhook cannot double-credit
direct card routes return blocked response
savings cancellation refunds only that saving's contributions
loan disbursement is idempotent
```

### 8.2 Wallet Ledger Completeness

All future wallet operations should use `WalletService`:

- wallet funding,
- withdrawal,
- investment purchase,
- savings contribution,
- savings refund,
- loan disbursement,
- loan repayment.

No controller or model should call `$user->wallet += ...` directly.

### 8.3 Replace All Money Floats/Doubles

Use `decimal(18, 2)` or integer minor units for all money fields.

Recommended best long-term approach:

```text
wallet_kobo BIGINT
amount_kobo BIGINT
balance_before_kobo BIGINT
balance_after_kobo BIGINT
```

If that migration is too large now, use `DECIMAL(18,2)` consistently.

### 8.4 Finish Policy-Based Authorization

Move ownership and admin checks to Laravel policies:

```bash
php artisan make:policy LoanPolicy --model=Loan
php artisan make:policy TransactionPolicy --model=Transaction
php artisan make:policy SavingPolicy --model=Saving
php artisan make:policy InvestmentPolicy --model=Investment
```

Then call:

```php
$this->authorize('view', $transaction);
$this->authorize('cancel', $loan);
$this->authorize('update', $saving);
```

### 8.5 UI/UX Design System

Continue applying the supplied Figma pattern:

- purple sidebar on desktop,
- mobile drawer/sidebar on mobile,
- bottom-sheet payment flows on mobile,
- transaction cards on mobile instead of wide tables,
- dashboard metric cards in responsive grids,
- hosted payment CTA instead of direct card input,
- consistent `#5042DA` primary color,
- `#E9EAEB` borders,
- white cards,
- Inter typography,
- rounded card and button system.

### 8.6 Tooltips and Guided UX

Add contextual tooltips to:

- wallet balance,
- investment expected return,
- savings contribution schedule,
- loan eligibility,
- transaction status,
- KYC status,
- payment confirmation state,
- admin permission assignment.

Recommended implementation:

- use existing shadcn/Radix tooltip primitives if present,
- create a reusable `InfoTooltip` component,
- keep tooltip content short,
- use full help pages for complex explanations.

Example component:

```tsx
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

export function InfoTooltip({ text }: { text: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger type="button" className="inline-flex text-[#717680]">
          <Info className="h-4 w-4" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-sm">
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
```

---

## 9. Deployment Notes

After extracting the fixed package:

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
npm run build
php artisan queue:work
```

For production:

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
```

Make sure queues are supervised with Supervisor, systemd, Laravel Horizon, or another process monitor.

---

## 10. Security Checklist Before Launch

- [ ] Rotate any Monnify/payment secrets that were ever present in SQL dumps.
- [ ] Remove all SQL dumps from git history if this was committed.
- [ ] Ensure `.env` is never committed.
- [ ] Enable HTTPS only.
- [ ] Use secure cookies in production.
- [ ] Add rate limiting to auth and payment routes.
- [ ] Confirm webhook signature secret is correct.
- [ ] Confirm payment webhook URL is configured at Monnify.
- [ ] Confirm direct card collection remains disabled.
- [ ] Confirm admin routes require role/permission checks.
- [ ] Confirm wallet changes use `WalletService`.
- [ ] Confirm KYC middleware protects sensitive financial features.
- [ ] Enable logging/alerting for failed webhooks.
- [ ] Enable backup and database audit policy.

---

## 11. File Change Index

Key files added or changed in the fixed package:

```text
app/Http/Middleware/CheckPermission.php
app/Http/Middleware/CheckPermissionAbility.php
app/Http/Controllers/WebhookController.php
app/Http/Controllers/MonnifyTransactionController.php
app/Http/Controllers/LoanController.php
app/Models/Loan.php
app/Models/Saving.php
app/Models/WalletLedger.php
app/Services/WalletService.php
app/Services/WalletFundingService.php
database/migrations/2026_05_23_000001_harden_wallet_and_transactions.php
routes/monnify.php
routes/user.php
routes/web.php
resources/css/app.css
resources/js/pages/Documentation/AdminGuide.tsx
resources/js/pages/Documentation/UserGuide.tsx
OPTIVEST_DOCUMENTATION.md
SECURITY_AND_FIXES_SUMMARY.md
BUILD_VALIDATION.md
.gitignore
```

---

## 12. Closing Notes

The most important architectural decision implemented here is the wallet ledger/idempotency pattern. In a fintech app, wallet mutations must be centralized, auditable, and idempotent. Future developers should avoid direct wallet changes outside `WalletService`.

The second most important decision is disabling direct card-data collection. Hosted checkout or tokenized provider flows are safer and reduce compliance exposure.

The third major decision is separating user/admin documentation directly in the app. This improves onboarding, reduces support load, and gives admins a structured operating checklist.

This document should be kept with the project as the historical record of the security, backend, frontend, and UI stabilization work.
