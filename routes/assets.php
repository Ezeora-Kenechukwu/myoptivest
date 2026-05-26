<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AssetCategoryController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\User\AssetController as UserAssetController;
use App\Http\Controllers\User\PositionController as UserPositionController;

// Admin routes
Route::prefix('admin')->name('admin.')->middleware(['auth', 'admin'])->group(function () {
    Route::resource('asset-categories', AssetCategoryController::class);
    Route::resource('assets', AssetController::class);
    Route::get('positions/pending-sells', [PositionController::class, 'pendingSells'])->name('admin.positions.pending-sells');
    Route::get('positions/pending-sells/data', [PositionController::class, 'getPendingSellsData'])->name('position.pending-sells.data');
    Route::post('positions/{position}/approve-sell', [PositionController::class, 'approveSell'])->name('admin.positions.approve-sell');
    Route::post('positions/{position}/decline-sell', [PositionController::class, 'declineSell'])->name('admin.positions.decline-sell');
});

// User routes
Route::middleware('auth')->group(function () {
    Route::get('assets', [AssetController::class, 'userindex'])->name('user.assets.index');
    Route::get('assets/{asset}', [AssetController::class, 'usershow'])->name('user.assets.show');
    Route::post('assets/{asset}/purchase', [AssetController::class, 'purchase'])->name('user.assets.purchase');
    Route::get('positions', [PositionController::class, 'index'])->name('user.positions.index');
    Route::post('positions/{position}/transfer', [PositionController::class, 'transfer'])->name('user.positions.transfer');
    Route::post('positions/{position}/request-sell', [PositionController::class, 'requestSell'])->name('user.positions.request-sell');
});
