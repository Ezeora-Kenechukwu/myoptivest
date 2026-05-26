<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\LoanStatusUpdated;
use App\Services\WalletService;
use Carbon\Carbon;

class Loan extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'loan_plan_id',
        'amount',
        'interest_rate',
        'duration',
        'total_repayment',
        'status',
        'approved_by',
        'approved_at',
        'rejected_by',
        'rejected_at',
        'disbursed_at',
        'cancelled_at',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
        'disbursed_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function loanPlan()
    {
        return $this->belongsTo(LoanPlan::class, 'loan_plan_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function rejector()
    {
        return $this->belongsTo(User::class, 'rejected_by');
    }

    public function repayments()
    {
        return $this->hasMany(LoanRepayment::class);
    }

    public function disburse()
    {
        try {
            return DB::transaction(function () {
                $loan = self::whereKey($this->id)->lockForUpdate()->firstOrFail();

                if ($loan->status === 'disbursed') {
                    return $loan;
                }

                $loan->update([
                    'status' => 'disbursed',
                    'disbursed_at' => now(),
                ]);

                $user = $loan->user;
                $transaction = Transaction::firstOrCreate(
                    ['reference' => 'LOAN-DISBURSEMENT-' . $loan->id],
                    [
                        'user_id' => $loan->user_id,
                        'type' => 'loan_disbursement',
                        'amount' => $loan->amount,
                        'method' => 'wallet',
                        'status' => 'approved',
                        'note' => 'Loan disbursement for Loan ID: ' . $loan->id,
                        'approved_by' => $loan->approved_by,
                        'approved_at' => now(),
                        'confirmed_by' => $loan->approved_by,
                        'confirmed_at' => now(),
                        'paid_at' => now(),
                    ]
                );

                app(WalletService::class)->credit(
                    $user,
                    $loan->amount,
                    'loan_disbursement',
                    'loan-disbursement:' . $loan->id,
                    $transaction,
                    ['loan_id' => $loan->id]
                );

                if (!$loan->repayments()->exists()) {
                    $loan->createRepaymentSchedule();
                }

                $loan->sendNotification('loan_disbursed', "Your loan of ₦{$loan->amount} has been disbursed.");
                Mail::to($user->email)->send(new LoanStatusUpdated($loan, 'disbursed'));
                $admin = User::where('type', 'admin')->first();
                if ($admin) {
                    Mail::to($admin->email)->send(new LoanStatusUpdated($loan, 'disbursed', true));
                }

                return $loan;
            });
        } catch (\Exception $e) {
            Log::error('Failed to disburse loan', [
                'loan_id' => $this->id,
                'user_id' => $this->user_id,
                'error' => $e->getMessage(),
            ]);
            throw new \Exception('Failed to disburse loan. Please try again.');
        }
    }

    public function cancel()
    {
        if ($this->status !== 'pending') {
            throw new \Exception('Only pending loans can be cancelled.');
        }

        try {
            return DB::transaction(function () {
                $this->update([
                    'status' => 'cancelled',
                    'cancelled_at' => now(),
                ]);

                // Notify user and admin
                $this->sendNotification('loan_cancelled', "Your loan request of ₦{$this->amount} has been cancelled.");
                Mail::to($this->user->email)->send(new LoanStatusUpdated($this, 'cancelled'));
                $admin = User::where('type', 'admin')->first();
                if ($admin) {
                    Mail::to($admin->email)->send(new LoanStatusUpdated($this, 'cancelled', true));
                }
            });
        } catch (\Exception $e) {
            Log::error('Failed to cancel loan', [
                'loan_id' => $this->id,
                'user_id' => $this->user_id,
                'error' => $e->getMessage(),
            ]);
            throw new \Exception('Failed to cancel loan. Please try again.');
        }
    }

    public function createRepaymentSchedule()
    {
        $monthlyPayment = $this->total_repayment / ($this->duration / 30); // Monthly payments
        $startDate = Carbon::now();

        for ($i = 1; $i <= ($this->duration / 30); $i++) {
            LoanRepayment::create([
                'loan_id' => $this->id,
                'amount' => $monthlyPayment,
                'due_date' => $startDate->copy()->addMonths($i),
                'status' => 'pending',
            ]);
        }
    }

    public function processRepayments()
    {
        $user = $this->user;
        $pendingRepayments = $this->repayments()->whereIn('status', ['pending', 'overdue'])->orderBy('due_date')->get();

        foreach ($pendingRepayments as $repayment) {
            if ($user->withdrawable_investment_balance >= $repayment->amount) {
                DB::transaction(function () use ($user, $repayment) {
                    $user->withdrawable_investment_balance -= $repayment->amount;
                    $user->save();

                    $repayment->update([
                        'status' => 'paid',
                        'paid_at' => now(),
                    ]);

                    // Notify user
                    $this->sendNotification('loan_repayment', "Loan repayment of ₦{$repayment->amount} processed successfully.");
                    Mail::to($user->email)->send(new LoanStatusUpdated($this, 'repaid', false, $repayment->amount));
                });
            } else {
                if (Carbon::parse($repayment->due_date)->isPast()) {
                    $repayment->update(['status' => 'overdue']);
                    $this->sendNotification('loan_overdue', "Loan repayment of ₦{$repayment->amount} is overdue.");
                    Mail::to($user->email)->send(new LoanStatusUpdated($this, 'overdue', false, $repayment->amount));
                }
            }
        }

        // Check if all repayments are paid
        if ($this->repayments()->where('status', '!=', 'paid')->count() === 0) {
            $this->update(['status' => 'repaid']);
            $this->sendNotification('loan_fully_repaid', "Your loan of ₦{$this->amount} has been fully repaid.");
            Mail::to($user->email)->send(new LoanStatusUpdated($this, 'fully_repaid'));
        }
    }

    public function payManually($amount)
    {
        $user = $this->user;
        if ($user->withdrawable_investment_balance < $amount) {
            throw new \Exception('Insufficient withdrawable investment balance.');
        }

        $remaining = $amount;
        $pendingRepayments = $this->repayments()->whereIn('status', ['pending', 'overdue'])->orderBy('due_date')->get();

        DB::transaction(function () use ($user, $remaining, $pendingRepayments) {
            $remainingAmount = $remaining;
            foreach ($pendingRepayments as $repayment) {
                if ($remainingAmount <= 0) break;

                $payable = min($repayment->amount, $remainingAmount);
                $repayment->update([
                    'amount' => $repayment->amount - $payable,
                    'status' => $payable >= $repayment->amount ? 'paid' : 'pending',
                    'paid_at' => $payable >= $repayment->amount ? now() : $repayment->paid_at,
                ]);

                $remainingAmount -= $payable;
            }

            $user->withdrawable_investment_balance -= ($remaining - $remainingAmount);
            $user->save();
            $bb = $remaining - $remainingAmount;
            // Notify user and admin
            $this->sendNotification('loan_manual_payment', "Manual loan payment of ₦{$bb} processed successfully.");
            Mail::to($user->email)->send(new LoanStatusUpdated($this, 'manual_payment', false, $remaining - $remainingAmount));
            $admin = User::where('type', 'admin')->first();
            if ($admin) {
                Mail::to($admin->email)->send(new LoanStatusUpdated($this, 'manual_payment', true, $remaining - $remainingAmount));
            }

            // Check if loan is fully repaid
            if ($this->repayments()->where('status', '!=', 'paid')->count() === 0) {
                $this->update(['status' => 'repaid']);
                $this->sendNotification('loan_fully_repaid', "Your loan of ₦{$this->amount} has been fully repaid.");
                Mail::to($user->email)->send(new LoanStatusUpdated($this, 'fully_repaid'));
                if ($admin) {
                    Mail::to($admin->email)->send(new LoanStatusUpdated($this, 'fully_repaid', true));
                }
            }
        });
    }

    protected function sendNotification($type, $message, $userId = null)
    {
        Notification::create([
            'notifiable_id' => $userId ?? $this->user_id,
            'notifiable_type' => User::class,
            'type' => $type,
            'data' => [
                'message' => $message,
                'loan_id' => $this->id,
            ],
        ]);
    }
}
