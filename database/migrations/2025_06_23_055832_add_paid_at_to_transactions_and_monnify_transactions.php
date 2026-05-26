<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
{
    Schema::table('transactions', function (Blueprint $table) {
        $table->timestamp('paid_at')->nullable();
    });

    Schema::table('monnify_transactions', function (Blueprint $table) {
        $table->timestamp('paid_at')->nullable();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions_and_monnify_transactions', function (Blueprint $table) {
            //
        });
    }
};

