<?php

use App\Http\Controllers\MonnifyTransactionController;
use App\Http\Controllers\WebhookController;
use Illuminate\Support\Facades\Route;

Route::post('monnify/webhook', [WebhookController::class, 'handleMonnifyWebhook'])->name('monnify.webhook');

Route::middleware(['auth', 'verified', 'kyc'])->prefix('monnify')->group(function () {
    Route::post('init-transfer', [MonnifyTransactionController::class, 'initTransfer'])->name('monnify.init-transfer');
    Route::post('init-card', [MonnifyTransactionController::class, 'initCard'])->name('card-init');
    Route::post('confirm-transfer', [MonnifyTransactionController::class, 'confirmTransfer'])->name('confirm-transfer');
    Route::post('checkout/init', [MonnifyTransactionController::class, 'initiateCheckout'])->name('checkout-init');
    Route::get('checkout/callback', [MonnifyTransactionController::class, 'checkoutcallback'])->name('checkout-callback');

    // Direct PAN/CVV/PIN collection is intentionally blocked. Use hosted checkout/tokenized provider flows.
    Route::post('card/charge', [MonnifyTransactionController::class, 'blockedDirectCardCharge'])->name('charge-card');
    Route::post('card/otp-authorize', [MonnifyTransactionController::class, 'blockedDirectCardCharge'])->name('card-otp-autorize');
    Route::post('card/3ds-authorize', [MonnifyTransactionController::class, 'blockedDirectCardCharge'])->name('card-3ds-authorize');
});
