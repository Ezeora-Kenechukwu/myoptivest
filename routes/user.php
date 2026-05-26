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
