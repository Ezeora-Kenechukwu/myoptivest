<?php

namespace App\Notifications;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;

class TransactionStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $transaction;
    public $action;

    public function __construct(Transaction $transaction, string $action)
    {
        $this->transaction = $transaction;
        $this->action = $action; // e.g. created, approved, declined, confirmed
    }

    public function via($notifiable): array
    {
        return ['mail', 'database', 'broadcast'];
    }

    public function toMail($notifiable): MailMessage
    {
        $message = (new MailMessage)
            ->subject('Transaction ' . ucfirst($this->action))
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line("Your transaction of ₦{$this->transaction->amount} for {$this->transaction->type} has been {$this->action}.");

        if ($this->action === 'declined' && $this->transaction->note) {
            $message->line('Reason: ' . $this->transaction->note);
        }

        $message->line('Status: ' . ucfirst($this->transaction->status))
                ->line('Thank you for using our platform.');

        return $message;
    }

    public function toArray($notifiable): array
    {
        return [
            'transaction_id' => $this->transaction->id,
            'type' => $this->transaction->type,
            'amount' => $this->transaction->amount,
            'status' => $this->transaction->status,
            'action' => $this->action,
            'note' => $this->transaction->note,
            'user_id' => $this->transaction->user_id,
            'created_at' => now(),
        ];
    }

    public function toBroadcast($notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'data' => $this->toArray($notifiable),
            'created_at' => now()->toDateTimeString(),
        ]);
    }
}
