<?php

use App\Http\Controllers\Admin\LoanPlanController;
use App\Http\Controllers\LoanController;
use Illuminate\Support\Facades\Route;

// Admin Routes
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->group(function () {
    Route::middleware('permission:Loan Settings')->group(function () {
        Route::get('loan-plans', [LoanPlanController::class, 'index'])->name('admin.loan-plans.index');
        Route::post('loan-plans', [LoanPlanController::class, 'store'])->name('admin.loan-plans.store');
        Route::get('loan-plans/{loanPlan}/edit', [LoanPlanController::class, 'edit'])->name('admin.loan-plans.edit');
        Route::put('loan-plans/{loanPlan}', [LoanPlanController::class, 'update'])->name('admin.loan-plans.update');
        Route::delete('loan-plans/{loanPlan}', [LoanPlanController::class, 'destroy'])->name('admin.loan-plans.destroy');
        Route::post('loan-plans/{loanPlan}/toggle-active', [LoanPlanController::class, 'toggleActive'])->name('admin.loan-plans.toggle-active');
        Route::get('loan-plans/{loanPlan}', [LoanPlanController::class, 'show'])->name('admin.loan-plans.show');
    });

    Route::middleware('permission:Loan Manager')->group(function () {
        Route::get('loans', [LoanController::class, 'adminIndex'])->name('admin.loans.index');
        Route::post('loans/{loan}/approve', [LoanController::class, 'approve'])->name('admin.loans.approve');
        Route::post('loans/{loan}/reject', [LoanController::class, 'reject'])->name('admin.loans.reject');
    });
});

// User Routes
Route::middleware(['auth', 'verified', 'kyc'])->group(function () {
    Route::get('loans', [LoanController::class, 'index'])->name('loans.index');
    Route::get('loans/create', [LoanController::class, 'create'])->name('loans.create');
    Route::post('loans', [LoanController::class, 'store'])->name('loans.store');
    Route::post('loans/{loan}/cancel', [LoanController::class, 'cancel'])->name('loans.cancel');
    Route::post('loans/{loan}/pay', [LoanController::class, 'pay'])->name('loans.pay');
});
