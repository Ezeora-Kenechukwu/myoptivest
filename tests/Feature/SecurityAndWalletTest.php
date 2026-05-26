<?php

use App\Models\Transaction;
use App\Models\User;
use App\Models\WalletLedger;
use App\Models\DailySaving;
use App\Models\Loan;
use App\Models\LoanPlan;
use App\Models\Saving;
use App\Models\SavingsPlan;
use App\Services\DailySavingService;
use App\Services\WalletService;
use Illuminate\Support\Facades\Mail;

test('monnify user payment routes require authentication', function () {
    $this->postJson('/monnify/init-transfer', [
        'amount' => 1000,
        'customer_name' => 'Test User',
        'customer_email' => 'test@example.com',
    ])->assertUnauthorized();
});

test('direct card collection routes are blocked for authenticated users', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->postJson('/monnify/card/charge', [
        'transactionReference' => 'MNFY|TEST',
        'card_number' => '4111111111111111',
        'expiry_month' => '12',
        'expiry_year' => '2030',
        'cvv' => '123',
        'pin' => '1234',
    ])->assertStatus(422)
        ->assertJsonPath('success', false);
});

test('wallet service is idempotent for repeated credits', function () {
    $user = User::factory()->create(['wallet' => 0]);
    $transaction = Transaction::create([
        'user_id' => $user->id,
        'type' => 'wallet',
        'amount' => 2500,
        'method' => 'Monnify',
        'status' => 'pending',
        'reference' => 'TEST-FUNDING-001',
    ]);

    $walletService = app(WalletService::class);

    $firstLedger = $walletService->credit($user, 2500, 'wallet_funding', 'test-credit:001', $transaction);
    $secondLedger = $walletService->credit($user, 2500, 'wallet_funding', 'test-credit:001', $transaction);

    expect($secondLedger->id)->toBe($firstLedger->id);
    expect((float) $user->refresh()->wallet)->toBe(2500.0);
    expect(WalletLedger::where('idempotency_key', 'test-credit:001')->count())->toBe(1);
});

test('users cannot view another users transaction', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    $transaction = Transaction::create([
        'user_id' => $owner->id,
        'type' => 'wallet',
        'amount' => 1000,
        'method' => 'Monnify',
        'status' => 'pending',
        'reference' => 'OWNER-TRANSACTION-001',
    ]);

    $this->actingAs($otherUser)
        ->get(route('transactions.show', $transaction))
        ->assertForbidden();
});

test('automatic daily saving contribution debits wallet only once', function () {
    $user = User::factory()->create(['wallet' => 5000, 'savings_balance' => 0]);
    $plan = SavingsPlan::create([
        'name' => 'Daily Plan',
        'short_description' => 'Daily savings',
        'daily_amount' => 1000,
        'duration' => 1,
        'target_amount' => 1000,
        'type' => 'normal',
        'active' => true,
        'created_by' => $user->id,
    ]);
    $saving = Saving::create([
        'user_id' => $user->id,
        'saving_plan_id' => $plan->id,
        'name' => 'Test Saving',
        'status' => 'pending',
        'start_date' => now()->toDateString(),
        'end_date' => now()->toDateString(),
        'duration' => 1,
        'amount_per_day' => 1000,
        'targeted_amount' => 1000,
        'active' => true,
    ]);
    $dailySaving = DailySaving::create([
        'saving_id' => $saving->id,
        'user_id' => $user->id,
        'status' => 'pending',
        'type' => 'automatic',
        'expected_payment_at' => now()->subHour(),
        'amount' => 1000,
        'transaction_reference' => 'DAILY-SAVING-TEST-001',
    ]);

    $service = app(DailySavingService::class);
    $service->processContribution($dailySaving);
    $service->processContribution($dailySaving->refresh());

    $user->refresh();

    expect((float) $user->wallet)->toBe(4000.0);
    expect((float) $user->savings_balance)->toBe(1000.0);
    expect($dailySaving->refresh()->status)->toBe('successful');
    expect(WalletLedger::where('idempotency_key', 'daily-saving:' . $dailySaving->id)->count())->toBe(1);
});

test('loan disbursement is idempotent', function () {
    Mail::fake();

    $admin = User::factory()->create(['type' => 'admin']);
    $user = User::factory()->create(['wallet' => 0]);
    $plan = LoanPlan::create([
        'name' => 'Starter Loan',
        'slug' => 'starter-loan',
        'min_amount' => 500,
        'max_amount' => 5000,
        'interest_rate' => 10,
        'duration' => 30,
        'min_profit_balance' => 0,
        'description' => 'Starter plan',
        'active' => true,
        'created_by' => $admin->id,
    ]);
    $loan = Loan::create([
        'user_id' => $user->id,
        'loan_plan_id' => $plan->id,
        'amount' => 1000,
        'interest_rate' => 10,
        'duration' => 30,
        'total_repayment' => 1100,
        'status' => 'approved',
        'approved_by' => $admin->id,
        'approved_at' => now(),
    ]);

    $loan->disburse();
    $loan->refresh()->disburse();

    expect((float) $user->refresh()->wallet)->toBe(1000.0);
    expect($loan->refresh()->status)->toBe('disbursed');
    expect(Transaction::where('reference', 'LOAN-DISBURSEMENT-' . $loan->id)->count())->toBe(1);
    expect(WalletLedger::where('idempotency_key', 'loan-disbursement:' . $loan->id)->count())->toBe(1);
    expect($loan->repayments()->count())->toBe(1);
});
