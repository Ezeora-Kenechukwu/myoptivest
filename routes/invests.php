<?php

use App\Http\Controllers\InvestmentController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'permission:Investments', 'kyc'])
    ->prefix('investments')
    ->name('investments.')
    ->group(function () {
        Route::get('/', [InvestmentController::class, 'index'])->name('index');
        Route::get('/create', [InvestmentController::class, 'create'])->name('create');
        Route::post('/', [InvestmentController::class, 'store'])->name('store');
        Route::get('/{investment}', [InvestmentController::class, 'show'])->name('show');
        Route::get('/{investment}/edit', [InvestmentController::class, 'edit'])->name('edit');
        Route::match(['put', 'patch'], '/{investment}', [InvestmentController::class, 'update'])->name('update');
    });

Route::middleware(['auth', 'verified', 'permission:ManageInvestments', 'kyc'])
    ->prefix('admin/investments')
    ->name('admin.investments.')
    ->group(function () {
        Route::get('/', [InvestmentController::class, 'index'])->name('index');
        Route::post('/', [InvestmentController::class, 'store'])->name('store');
        Route::get('/{investment}', [InvestmentController::class, 'show'])->name('show');
        Route::get('/{investment}/edit', [InvestmentController::class, 'edit'])->name('edit');
        Route::match(['put', 'patch'], '/{investment}', [InvestmentController::class, 'update'])->name('update');
        Route::post('/{investment}/approve', [InvestmentController::class, 'approve'])->name('approve');
        Route::post('/{investment}/reject', [InvestmentController::class, 'reject'])->name('reject');
    });
