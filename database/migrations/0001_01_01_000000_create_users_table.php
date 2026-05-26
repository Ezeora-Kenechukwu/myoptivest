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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ranking_id')->nullable();
            $table->json('rankings')->nullable();
            $table->string('avatar')->nullable();
            $table->string('name');
            $table->enum('type', ['admin', 'user', 'staff'])->default('user');
            $table->string('country');
            $table->string('countryCode');
            $table->string('phone');
            $table->string('username')->unique();
            $table->string('email')->unique();
            $table->enum('gender', ['male', 'female', 'other', ''])->default('');
            $table->date('date_of_birth')->nullable();
            $table->string('city')->nullable();
            $table->string('zip_code')->nullable();
            $table->string('refferal_code')->nullable();
            $table->text('address')->nullable();
            $table->decimal('wallet',10,2)->default(0);

            // Balance Fields
            $table->double('savings_balance')->default(0);
            $table->double('investment_balance')->default(0);
            $table->double('withdrawable_savings_balance')->default(0);
            $table->double('withdrawable_investment_balance')->default(0);
            $table->double('investment_profit_balance')->default(0);

            $table->boolean('status')->default(1);
            $table->boolean('kyc')->default(0);
            $table->json('kyc_credential')->nullable();
            $table->text('google2fa_secret')->nullable();
            $table->boolean('two_fa')->default(false);
            $table->boolean('deposit_status')->default(1);
            $table->boolean('withdraw_status')->default(0);
            $table->boolean('transfer_status')->default(0);
            $table->integer('ref_id')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });


        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });

        Schema::create('role_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('role_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('permission_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('permission_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Action-level permissions (same set)
            $table->boolean('can_create')->default(false);
            $table->boolean('can_edit')->default(false);
            $table->boolean('can_view')->default(false);
            $table->boolean('can_delete')->default(false);
            $table->boolean('can_forceDelete')->default(false);
            $table->boolean('can_index')->default(false);
            $table->boolean('can_store')->default(false);
            $table->boolean('can_approve')->default(false);
            $table->boolean('can_restore')->default(false);
            $table->boolean('can_indexTrash')->default(false);
            $table->boolean('can_viewTrash')->default(false);
            $table->boolean('can_assign')->default(false);
            $table->boolean('can_update')->default(false);
            $table->boolean('can_join')->default(false);
            $table->boolean('can_pin')->default(false);
            $table->boolean('can_share')->default(false);
            $table->boolean('can_copy')->default(false);
            $table->boolean('can_download')->default(false);
            $table->boolean('can_preview')->default(false);
            $table->boolean('can_upload')->default(false);
            $table->boolean('can_pay')->default(false);
            $table->boolean('can_withdraw')->default(false);
            $table->boolean('can_rank')->default(false);
            $table->boolean('can_show')->default(false);
            $table->boolean('can_block')->default(false);
            $table->boolean('can_unblock')->default(false);
            $table->boolean('can_activate')->default(false);
            $table->boolean('can_deactivate')->default(false);
            $table->boolean('can_suspend')->default(false);
            $table->boolean('can_unsuspend')->default(false);
            $table->boolean('can_confirm')->default(false);
            $table->boolean('can_reply')->default(false);
            $table->boolean('can_send')->default(false);
            $table->boolean('can_notify')->default(false);
            $table->boolean('can_read')->default(false);
            $table->boolean('can_readall')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permission_user');
        Schema::dropIfExists('role_user');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};
