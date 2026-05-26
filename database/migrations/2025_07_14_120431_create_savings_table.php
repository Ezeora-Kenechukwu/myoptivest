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
        Schema::create('savings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('saving_plan_id')->constrained('savings_plans')->cascadeOnDelete();
            $table->string('name');
            $table->enum('status', ['pending', 'started', 'cancelled', 'completed'])->default('pending');
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('duration');
            $table->double('amount_per_day');
            $table->double('targeted_amount');
            $table->boolean('active')->default(true);
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_on')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('savings');
    }
};
