<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('manual_payment_methods', function (Blueprint $table) {
            $table->id(); // Unique ID for each manual payment method

            $table->string('name');
            // Name of the payment method, e.g. "Bank Transfer", "Bitcoin", "Ethereum"
            $table->enum('type',[
                'bank_transfer',
                'crypto',
            ]);
            // Type of payment method, e.g. "bank_transfer", "crypto"
            // This will help in categorizing the payment methods
            // and applying specific validation rules in the frontend
            // and backend.
            $table->string('icon')->nullable();
            // Optional icon for the payment method (e.g. "bank_transfer.png")

            $table->text('instructions')->nullable();
            // Optional instructions for the user on how to complete the payment
            // e.g. "Send BTC to this wallet address and upload your proof of payment."

            $table->string('account_name')->nullable();
            // Optional bank account name (for fiat bank transfers)

            $table->string('account_number')->nullable();
            // Optional bank account number (for fiat bank transfers)

            $table->string('bank_name')->nullable();
            // Optional bank name (e.g. "Access Bank") — only applies to fiat transfers

            $table->string('wallet_address')->nullable();
            // Optional cryptocurrency wallet address (for crypto methods like BTC, ETH)

            $table->boolean('active')->default(true);
            // Flag to enable/disable this payment method without deleting it

            $table->timestamps();
            // Created at & Updated at timestamps
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('manual_payment_methods');
    }
};
