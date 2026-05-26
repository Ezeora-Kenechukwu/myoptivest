<?php

use App\Http\Controllers\ReferralSettingController;
use Illuminate\Support\Facades\Route;

Route::prefix('referral-settings')->middleware(['auth', 'verified','permission:ReferalSettings','kyc'])->group(function () {
    Route::get('/', [ReferralSettingController::class, 'index'])->name('referral-settings.index');
    Route::post('/', [ReferralSettingController::class, 'store'])->name('referral-settings.upsert');
});
