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
        Schema::create('investment_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug');
            $table->double('min_amount');
            $table->double('max_amount')->nullable();
            $table->double('roi');
            $table->integer('duration'); // in hours
            $table->enum('payout_frequency', ['hourly','monthly', 'weekly', 'yearly', 'daily']);
            $table->string('thumbnail')->nullable(); // Image path
            $table->json('photos')->nullable(); // Multiple image paths
            $table->string('short_description')->nullable();
            $table->longText('long_description')->nullable(); // HTML from Jodit
            $table->boolean('active')->default(true);
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->foreignId('category_id')->constrained('investment_plan_categories')->cascadeOnDelete();
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
        Schema::dropIfExists('investment_plas');
    }
};
