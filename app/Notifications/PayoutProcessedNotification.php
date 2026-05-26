<?php

namespace App\Notifications;

use App\Models\Payout;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class PayoutProcessedNotification extends Notification
{
    use Queueable;

    protected $payout;

    public function __construct(Payout $payout)
    {
        $this->payout = $payout;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Payout Processed')
            ->line("Your payout of ₦" . number_format($this->payout->amount, 2) . " for investment #{$this->payout->investment_id} has been processed.")
            ->line("Payout Index: {$this->payout->payout_index}")
            ->line("Date: {$this->payout->paid_at->format('Y-m-d H:i:s')}")
            ->action('View Investment Details', route('investments.index'))
            ->line('Thank you for using Optivest!');
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'payout_processed',
            'message' => "Payout of ₦" . number_format($this->payout->amount, 2) . " for investment #{$this->payout->investment_id} processed.",
            'investment_id' => $this->payout->investment_id,
            'payout_index' => $this->payout->payout_index,
        ];
    }
}
