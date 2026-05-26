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
        Schema::create('savings_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();

            // Financial Details
            $table->double('daily_amount');
            $table->integer('duration'); // in days
            $table->double('target_amount')->nullable();
            $table->enum('type', ['normal', 'investment']);
            $table->double('monthly_charge')->default(0);

            // Descriptions
            $table->string('short_description')->nullable();
            $table->longText('long_description')->nullable();

            // Media
            $table->string('thumbnail')->nullable();
            $table->json('photos')->nullable();

            // Flags
            $table->boolean('active')->default(true);

            // Audit
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_on')->nullable();
            $table->foreignId('last_updated_by')->nullable()->constrained('users')->nullOnDelete();

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('savings_plans');
    }
};
