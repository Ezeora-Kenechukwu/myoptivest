<?php

use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified','kyc'])->group(function () {
    Route::resource('transactions', TransactionController::class)->except('edit', 'update', 'create');

    Route::post('transactions/{transaction}/approve', [TransactionController::class, 'approve'])->name('transactions.approve');
    Route::post('transactions/{transaction}/decline', [TransactionController::class, 'decline'])->name('transactions.decline');
    Route::post('transactions/{transaction}/confirm', [TransactionController::class, 'confirm'])->name('transactions.confirm');

    Route::post('transactions/{id}/restore', [TransactionController::class, 'restore'])->name('transactions.restore');
    Route::delete('transactions/{id}/force-delete', [TransactionController::class, 'forceDelete'])->name('transactions.forceDelete');
});
