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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('type', [
                'investment',
                'saving',
                'withdrawal',
                'wallet',
                'loan_disbursement',
                'loan_repayment',
                'savings_refund',
            ]);
            $table->decimal('amount', 15, 2);
            $table->string('method')->nullable(); // e.g. bank, transfer, crypto
            $table->string('reference')->nullable(); // e.g. bank, transfer, crypto
            $table->string('proof')->nullable();  // file path
            $table->enum('status', ['pending', 'declined','canceled', 'confirmed', 'approved'])->default('pending');
            $table->text('note')->nullable(); // decline reason or instructions

            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('method_id')->nullable()->constrained('manual_payment_methods')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();

            $table->foreignId('confirmed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('confirmed_at')->nullable();

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
