<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Position;

class SellRequestNotification extends Notification
{
    use Queueable;

    protected $position;

    public function __construct(Position $position)
    {
        $this->position = $position;
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database', 'broadcast'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->line('A user has requested to sell an asset.')
                    ->line('User: ' . $this->position->user->name)
                    ->line('Asset: ' . $this->position->asset->name)
                    ->line('Requested Price: ' . $this->position->sell_requested_price)
                    ->action('View Request', url('/admin/positions/pending-sells'));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'position_id' => $this->position->id,
            'user_name' => $this->position->user->name,
            'asset_name' => $this->position->asset->name,
            'requested_price' => $this->position->sell_requested_price,
        ];
    }
}
