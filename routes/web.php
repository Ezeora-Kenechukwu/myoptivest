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
require __DIR__.'/assets.php';
