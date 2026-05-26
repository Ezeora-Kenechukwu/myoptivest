<?php

namespace App\Jobs;

use App\Models\Investment;
use App\Models\User;
use App\Notifications\InvestmentStatusNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class SendInvestmentNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $investment;
    protected $status;
    protected $isAdmin;

    public function __construct(Investment $investment, string $status, bool $isAdmin = false)
    {
        $this->investment = $investment;
        $this->status = $status;
        $this->isAdmin = $isAdmin;
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
                        $admin->notify(new InvestmentStatusNotification($this->investment, $this->status, true));
                    } catch (\Throwable $e) {
                        Log::error('Failed to notify admin of investment', [
                            'admin_id' => $admin->id,
                            'investment_id' => $this->investment->id,
                            'status' => $this->status,
                            'error' => $e->getMessage(),
                        ]);
                    }
                }
            } else {
                $this->investment->user()->notify(new InvestmentStatusNotification($this->investment, $this->status));
            }
        } catch (\Throwable $e) {
            Log::error('Failed to send investment notification', [
                'investment_id' => $this->investment->id,
                'status' => $this->status,
                'is_admin' => $this->isAdmin,
                'error' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
            ]);
        }
    }
}
