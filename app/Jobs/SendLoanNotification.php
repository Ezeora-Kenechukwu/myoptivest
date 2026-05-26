<?php

namespace App\Jobs;

use App\Models\Loan;
use App\Models\User;
use App\Notifications\LoanStatusNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class SendLoanNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $loan;
    protected $status;
    protected $isAdmin;
    protected $amount;

    public function __construct(Loan $loan, string $status, bool $isAdmin = false, $amount = null)
    {
        $this->loan = $loan;
        $this->status = $status;
        $this->isAdmin = $isAdmin;
        $this->amount = $amount;
    }

    public function handle()
    {
        try {
            if ($this->isAdmin) {
                $admins = Cache::remember('admin_users', 3600, fn() =>
                    User::where('type', 'admin')->select('id')->get()
                );
                foreach ($admins as $admin) {
                    try {
                        $admin->notify(new LoanStatusNotification($this->loan, $this->status, true, $this->amount));
                    } catch (\Throwable $e) {
                        Log::error('Failed to notify admin of loan', [
                            'admin_id' => $admin->id,
                            'loan_id' => $this->loan->id,
                            'status' => $this->status,
                            'error' => $e->getMessage(),
                        ]);
                    }
                }
            } else {
                $this->loan->user()->notify(new LoanStatusNotification($this->loan, $this->status, false, $this->amount));
            }
        } catch (\Throwable $e) {
            Log::error('Failed to send loan notification', [
                'loan_id' => $this->loan->id,
                'status' => $this->status,
                'is_admin' => $this->isAdmin,
                'error' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
            ]);
        }
    }
}
