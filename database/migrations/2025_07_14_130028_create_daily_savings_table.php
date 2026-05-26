<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
         Schema::create('daily_savings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('saving_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('status', ['pending', 'successful', 'failed', 'cancelled'])->default('pending');
            $table->enum('type', ['manual', 'automatic'])->default('manual');
            $table->dateTime('expected_payment_at');
            $table->double('amount');
            $table->dateTime('paid_at')->nullable();
            $table->foreignId('processed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('transaction_reference')->nullable()->unique();
            $table->text('failure_reason')->nullable();
            $table->unsignedInteger('retry_count')->default(0);
            $table->dateTime('cancelled_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_savings');
    }
};
// in the savings, there should be status which should be pending, started, cancelled, and completed. also there you be method (which should be automatic and manual) so it the saving is manual, then the money will be deposited mannually and if it is automatic then the money will be  automatic, I want it this way, when a user creates a savings,daily_savings equal to the number of durations will be created, you should add a column type(which should be enum with manual and automatic) to the daily_savings. so the ones that have type automatic will be automated. I dont want to use a scheduler. I want to create a middleware that runs at each request, and should call the service every one hour which gets the daily_savings that are automated and the status is pending or failed and should not be cancelled, get the user, deduct the money from the user.wallet, and add the money to user.savings_balance, then change the status to completed, if the amount in the wallet is not sufficient, then the status will be failed, failure_reason is insufficient_fund.
