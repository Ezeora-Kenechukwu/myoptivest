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
        Schema::create('referral_bonuses', function (Blueprint $table) {
            $table->id();

            $table->foreignId('referrer_id')->constrained('users')->comment('The user who receives the bonus');
            $table->foreignId('referred_id')->constrained('users')->comment('The user whose action triggered the bonus');

            $table->enum('type', ['investment', 'savings'])->comment('Bonus type (context)');
            $table->decimal('amount', 12, 2)->comment('Bonus amount given');
            $table->unsignedInteger('level')->default(1)->comment('1 for direct, 2 for second generation, etc.');

            $table->foreignId('referral_setting_id')->nullable()->constrained('referral_settings')->comment('Optional link to which settings generated this');
            $table->string('source_type')->nullable()->comment('Polymorphic source type: e.g., App\\Models\\Investment');
            $table->unsignedBigInteger('source_id')->nullable()->comment('ID of the triggering model instance');

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
        Schema::dropIfExists('referral_bonuses');
    }
};
