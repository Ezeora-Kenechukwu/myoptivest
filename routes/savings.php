<?php

use App\Http\Controllers\DailySavingController;
use App\Http\Controllers\SavingsPlanController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SavingController;
Route::middleware(['auth', 'verified','permission:SavingsPlan','kyc'])->prefix('savings-plans')->name('savings-plans.')->group(function () {
    Route::get('/', [SavingsPlanController::class, 'index'])->name('index');
    Route::get('/create', [SavingsPlanController::class, 'create'])->name('create');
    Route::post('/', [SavingsPlanController::class, 'store'])->name('store');
    Route::get('/{savings_plan}/edit', [SavingsPlanController::class, 'edit'])->name('edit');
    Route::post('/{savings_plan}', [SavingsPlanController::class, 'update'])->name('update');
    Route::get('/{savings_plan}', [SavingsPlanController::class, 'show'])->name('show');
    Route::delete('/{savings_plan}', [SavingsPlanController::class, 'destroy'])->name('destroy');
    Route::post('/{slug}/restore', [SavingsPlanController::class, 'restore'])->name('restore');
    Route::delete('/{slug}/force-delete', [SavingsPlanController::class, 'forceDelete'])->name('forceDelete');
    Route::post('/{slug}/activate', [SavingsPlanController::class, 'activate'])->name('activate');
    Route::post('/{slug}/deactivate', [SavingsPlanController::class, 'deactivate'])->name('deactivate');
    Route::post('/{slug}/approve', [SavingsPlanController::class, 'approve'])->name('approve');

});

Route::prefix('savings')->middleware(['auth', 'verified', 'kyc'])->name('savings.')->group(function () {
    
    Route::get('/', [SavingController::class, 'index'])->name('index');
    Route::get('/create', [SavingController::class, 'create'])->name('create');
    Route::post('/', [SavingController::class, 'store'])->name('store');
    Route::get('/{saving}', [SavingController::class, 'show'])->name('show');
    Route::get('/{saving}/edit', [SavingController::class, 'edit'])->name('edit');
    Route::put('/{saving}', [SavingController::class, 'update'])->name('update');
    Route::patch('/{saving}/deactivate', [SavingController::class, 'deactivate'])->name('deactivate');
    Route::patch('/{saving}/activate', [SavingController::class, 'activate'])->name('activate');
    Route::delete('/{saving}', [SavingController::class, 'destroy'])->name('destroy');
    Route::match(['patch', 'post'], '/{saving}/approve', [SavingController::class, 'approve'])->name('approve');
    Route::post('/{saving}/contribute', [DailySavingController::class, 'store'])->name('contribute');
    Route::match(['patch', 'post'], '/{saving}/cancel', [SavingController::class, 'cancel'])->name('cancel');
});
Route::prefix('admin/savings')->middleware(['auth', 'verified', 'admin', 'permission:SavingsPlan'])->name('admin.savings.')->group(function () {
    Route::get('/', [SavingController::class, 'index'])->name('index');
    Route::get('/create', [SavingController::class, 'create'])->name('create');
    Route::post('/', [SavingController::class, 'store'])->name('store');
    Route::get('/{saving}', [SavingController::class, 'show'])->name('show');
    Route::get('/{saving}/edit', [SavingController::class, 'edit'])->name('edit');
    Route::put('/{saving}', [SavingController::class, 'update'])->name('update');
    Route::patch('/{saving}/deactivate', [SavingController::class, 'deactivate'])->name('deactivate');
    Route::patch('/{saving}/activate', [SavingController::class, 'activate'])->name('activate');
    Route::delete('/{saving}', [SavingController::class, 'destroy'])->name('destroy');
    Route::match(['patch', 'post'], '/{saving}/approve', [SavingController::class, 'approve'])->name('approve');
    Route::post('/{saving}/contribute', [DailySavingController::class, 'store'])->name('contribute');
    Route::match(['patch', 'post'], '/{saving}/cancel', [SavingController::class, 'cancel'])->name('cancel');
});
