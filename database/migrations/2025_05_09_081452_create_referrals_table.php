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
        Schema::create('referrals', function (Blueprint $table) {
            $table->id();

            $table->foreignId('referrer_id')->constrained('users')->comment('User who made the referral');
            $table->foreignId('referred_id')->constrained('users')->comment('User who was referred');

            $table->enum('type', ['investment', 'savings'])->comment('Referral type context (to match with referral_settings.type)');
            $table->string('slug')->unique();
            $table->softDeletes();
            $table->timestamps();

            $table->unique(['referrer_id', 'referred_id', 'type']); // prevent duplicate referrals of same type
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('referrals');
    }
};
