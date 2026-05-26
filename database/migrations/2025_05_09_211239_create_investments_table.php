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
        Schema::create('investments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('investment_plan_id')->constrained()->cascadeOnDelete();
            $table->double('invest_amount');
            $table->double('roi'); // from plan, stored for history
            $table->integer('number_of_periods');
            $table->integer('period_hours');
            $table->enum('payout_frequency', ['daily', 'weekly', 'monthly', 'yearly']);
            $table->double('total_expected_profit');
            $table->integer('profit_paid_count')->default(0);
            $table->dateTime('last_profit_at')->nullable();
            $table->dateTime('next_profit_at')->nullable();
            $table->boolean('capital_back')->default(true);
            $table->enum('status', ['pending', 'approved', 'rejected', 'completed'])->default('pending');
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('rejected_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('investments');
    }
};
