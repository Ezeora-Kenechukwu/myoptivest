<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('wallet_ledgers')) {
            Schema::create('wallet_ledgers', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->foreignId('transaction_id')->nullable()->constrained()->nullOnDelete();
                $table->enum('direction', ['credit', 'debit']);
                $table->decimal('amount', 18, 2);
                $table->decimal('balance_before', 18, 2);
                $table->decimal('balance_after', 18, 2);
                $table->string('provider', 191)->nullable();
                $table->string('provider_reference', 191)->nullable();
                $table->string('reason', 191);
                $table->json('metadata')->nullable();
                $table->string('idempotency_key')->unique();
                $table->timestamps();

                $table->index(['user_id', 'created_at']);
            });
            try {
                Schema::table('wallet_ledgers', function (Blueprint $table) {
                    $table->index(['provider', 'provider_reference'], 'wallet_ledgers_provider_provider_reference_index');
                });
            } catch (\Throwable $e) {
                // Skip indexing on older MySQL setups where index key length is limited.
            }
        }

        Schema::table('transactions', function (Blueprint $table) {
            if (!Schema::hasColumn('transactions', 'payment_reference')) {
                $table->string('payment_reference')->nullable()->after('reference');
            }
        });

        Schema::table('monnify_transactions', function (Blueprint $table) {
            if (!Schema::hasColumn('monnify_transactions', 'payment_reference')) {
                $table->string('payment_reference')->nullable()->after('reference');
            }
        });

        Schema::table('loans', function (Blueprint $table) {
            if (!Schema::hasColumn('loans', 'cancelled_at')) {
                $table->timestamp('cancelled_at')->nullable()->after('disbursed_at');
            }
        });

        if (Schema::hasTable('loan_repayments')) {
            Schema::table('loan_repayments', function (Blueprint $table) {
                if (!Schema::hasColumn('loan_repayments', 'loan_id')) {
                    $table->foreignId('loan_id')->nullable()->after('id')->constrained()->cascadeOnDelete();
                }
                if (!Schema::hasColumn('loan_repayments', 'amount')) {
                    $table->decimal('amount', 15, 2)->default(0)->after('loan_id');
                }
                if (!Schema::hasColumn('loan_repayments', 'due_date')) {
                    $table->date('due_date')->nullable()->after('amount');
                }
                if (!Schema::hasColumn('loan_repayments', 'status')) {
                    $table->string('status')->default('pending')->after('due_date');
                }
                if (!Schema::hasColumn('loan_repayments', 'paid_at')) {
                    $table->timestamp('paid_at')->nullable()->after('status');
                }
            });

            try {
                Schema::table('loan_repayments', function (Blueprint $table) {
                    $table->index(['loan_id', 'status'], 'loan_repayments_loan_id_status_index');
                });
            } catch (\Throwable $e) {
                // Keep this safe for installs where the index already exists.
            }
        }

        foreach ([
            ['transactions', 'reference', 'transactions_reference_unique'],
            ['transactions', 'payment_reference', 'transactions_payment_reference_unique'],
            ['monnify_transactions', 'reference', 'monnify_transactions_reference_unique'],
            ['monnify_transactions', 'payment_reference', 'monnify_transactions_payment_reference_unique'],
        ] as [$tableName, $column, $indexName]) {
            try {
                Schema::table($tableName, function (Blueprint $table) use ($column, $indexName) {
                    $table->unique($column, $indexName);
                });
            } catch (\Throwable $e) {
                // The source schema already has some unique indexes. Keep this migration idempotent for patched installs.
            }
        }

        // MySQL enum widening for loan disbursement; safe to skip on non-MySQL by catching deployment failures manually.
        try {
            DB::statement("ALTER TABLE transactions MODIFY type ENUM('investment','saving','withdrawal','wallet','loan_disbursement','loan_repayment','savings_refund') NOT NULL");
        } catch (\Throwable $e) {
            // Some databases do not support MODIFY ENUM. Existing app still works with string-like DB engines.
        }

        foreach ([
            'wallet',
            'savings_balance',
            'investment_balance',
            'withdrawable_savings_balance',
            'withdrawable_investment_balance',
            'investment_profit_balance',
        ] as $column) {
            try {
                DB::statement("ALTER TABLE users MODIFY {$column} DECIMAL(18, 2) NOT NULL DEFAULT 0.00");
            } catch (\Throwable $e) {
                // Keep migration portable for local SQLite/test databases.
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('wallet_ledgers');
    }
};
