<?php

use App\Http\Controllers\InvestmentPlanCategoryController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InvestmentPlanController;
Route::middleware(['auth', 'verified', 'permission:InvestmentPlanCategory','kyc'])
    ->prefix('investment-plan-categories')
    ->name('investment-plan-categories.')
    ->controller(InvestmentPlanCategoryController::class)
    ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/create', 'create')->name('create');
        Route::get('/{investmentplancategory}', 'show')->name('show');
        Route::get('/{investmentplancategory}/edit', 'edit')->name('edit');
        Route::post('/', 'store')->name('store');
        Route::put('/{investmentplancategory}', 'update')->name('update');
        Route::delete('/{investmentplancategory}', 'destroy')->name('destroy');
        Route::post('/{investmentplancategory}/restore', 'restore')->name('restore');
        Route::delete('/{investmentplancategory}/force-delete', 'forceDelete')->name('forceDelete');
        Route::post('/{investmentplancategory}/activate', 'activate')->name('activate');
        Route::post('/{investmentplancategory}/deactivate', 'deactivate')->name('deactivate');
    });
   
// 'permission:InvestmentPlan'
    Route::middleware(['auth', 'verified', 'permission:InvestmentPlan','kyc'])->prefix('investment-plans')->name('investment-plans.')->group(function () {
        Route::get('/', [InvestmentPlanController::class, 'index'])->name('index');
        Route::get('/create', [InvestmentPlanController::class, 'create'])->name('create');
        Route::post('/', [InvestmentPlanController::class, 'store'])->name('store');
        Route::get('/{investmentplan}', [InvestmentPlanController::class, 'show'])->name('show');
        Route::get('/{investmentplan}/edit', [InvestmentPlanController::class, 'edit'])->name('edit');
        Route::post('/{investmentplan}', [InvestmentPlanController::class, 'update'])->name('update');
        Route::delete('/{investmentplan}', [InvestmentPlanController::class, 'destroy'])->name('destroy');
        Route::post('/{investmentplan}/restore', [InvestmentPlanController::class, 'restore'])->name('restore');
        Route::delete('/{investmentplan}/force-delete', [InvestmentPlanController::class, 'forceDelete'])->name('forceDelete');
        Route::post('/{investmentplan}/activate', [InvestmentPlanController::class, 'activate'])->name('activate');
        Route::post('/{investmentplan}/deactivate', [InvestmentPlanController::class, 'deactivate'])->name('deactivate');
    });
    