<?php

namespace App\Jobs;

use App\Models\Cashout;
use App\Models\User;
use App\Notifications\CashoutNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendCashoutNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $cashout;

    public function __construct(Cashout $cashout)
    {
        $this->cashout = $cashout;
    }

    public function handle()
    {
        try {
            $this->cashout->user->notify(new CashoutNotification($this->cashout));
        } catch (\Throwable $e) {
            Log::error('Failed to send cashout notification', [
                'cashout_id' => $this->cashout->id,
                'user_id' => $this->cashout->user_id,
                'error' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
            ]);
        }
    }
}
