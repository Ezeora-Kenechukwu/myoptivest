<?php
use App\Http\Controllers\ManualPaymentMethodController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'permission:ManualPaymentMethod','kyc'])
->prefix('manual-payment-methods')->name('manual-payment-methods.')->group(function () {
    Route::get('/', [ManualPaymentMethodController::class, 'index'])->name('index');
    Route::get('/create', [ManualPaymentMethodController::class, 'create'])->name('create');
    Route::post('/', [ManualPaymentMethodController::class, 'store'])->name('store');
    Route::get('/{method}', [ManualPaymentMethodController::class, 'show'])->name('show');
    Route::get('/{method}/edit', [ManualPaymentMethodController::class, 'edit'])->name('edit');
    Route::post('/{method}', [ManualPaymentMethodController::class, 'update'])->name('update');
    Route::delete('/{method}', [ManualPaymentMethodController::class, 'destroy'])->name('destroy');
    Route::post('/{id}/activate', [ManualPaymentMethodController::class, 'activate'])->name('activate');
    Route::post('/{id}/deactivate', [ManualPaymentMethodController::class, 'deactivate'])->name('deactivate');
    Route::post('/{id}/restore', [ManualPaymentMethodController::class, 'restore'])->name('restore');
    Route::delete('/{id}/force-delete', [ManualPaymentMethodController::class, 'forceDelete'])->name('forceDelete');
});
