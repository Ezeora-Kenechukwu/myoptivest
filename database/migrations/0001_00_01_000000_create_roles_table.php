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

        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->enum('type', ['admin', 'editor', 'user'])->default('user'); // Role category
            $table->text('description');
            $table->boolean('base_role')->default(false);
            $table->foreignId('parent_role_id')->nullable()->constrained('roles')->nullOnDelete();
            $table->boolean('active')->default(true);
            $table->softDeletes();
            $table->timestamps();
        });
        Schema::create('role_permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_id')->constrained()->onDelete('cascade');
            $table->foreignId('permission_id')->constrained()->onDelete('cascade');
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
        Schema::dropIfExists('role_permissions');
        Schema::dropIfExists('roles');
    }
};
