<?php

namespace App\Notifications;

use App\Models\Cashout;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CashoutNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $cashout;

    public function __construct(Cashout $cashout)
    {
        $this->cashout = $cashout;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject("Cashout Processed")
            ->line("Your {$this->cashout->type} cashout of ₦{$this->cashout->amount} has been processed and credited to your wallet.");
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'cashout',
            'cashout_id' => $this->cashout->id,
            'amount' => $this->cashout->amount,
            'cashout_type' => $this->cashout->type,
        ];
    }
}
