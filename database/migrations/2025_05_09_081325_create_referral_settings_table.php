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
        Schema::create('referral_settings', function (Blueprint $table) {
            $table->id();

            $table->enum('type', ['investment', 'savings'])->comment('Type of referral system.');
            $table->boolean('is_active')->default(true)->comment('Enable or disable the referral system.');

            // Fixed bonus settings
            $table->boolean('use_fixed_bonus')->default(true)->comment('Use fixed amount bonus.');
            $table->decimal('fixed_bonus_amount', 12, 2)->nullable()->comment('Fixed bonus amount.');

            // Percentage bonus settings
            $table->boolean('use_percentage_bonus')->default(false)->comment('Use percentage-based bonus.');
            $table->decimal('percentage_bonus', 5, 2)->nullable()->comment('Percentage of amount.');

            // Tier control
            $table->boolean('enable_multi_tier')->default(false)->comment('Enable tiered fixed bonuses.');
            $table->json('bonus_rate_tiers')->nullable()->comment('Tiered fixed bonus, e.g. [{"limit":1,"bonus":5},{"limit":3,"bonus":3}]');

            // Downline control
            $table->boolean('enable_multi_downline')->default(false)->comment('Enable multi-level downline bonuses.');
            $table->integer('downline_levels')->default(0)->comment('Levels of downlines.');
            $table->json('downline_fixed_rates')->nullable()->comment('Fixed rates per generation, e.g. {"1":500,"2":200}');
            $table->json('downline_percentage_rates')->nullable()->comment('Percentage rates per generation, e.g. {"1":2,"2":1}');

            $table->integer('bonus_limit_per_referee')->nullable()->comment('Max earnings from a referee.');
            $table->integer('max_bonus_count')->nullable()->comment('Max amount of bonus. if null it means till infinity');
            $table->string('slug')->unique();
            $table->softDeletes();
            $table->timestamps();
        });








    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {


        Schema::dropIfExists('referal_settings');
    }
};
