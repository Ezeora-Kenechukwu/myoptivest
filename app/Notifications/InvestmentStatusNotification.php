<?php

namespace App\Notifications;

use App\Models\Investment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InvestmentStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $investment;
    protected $status;
    protected $isAdmin;

    public function __construct(Investment $investment, string $status, bool $isAdmin = false)
    {
        $this->investment = $investment;
        $this->status = $status;
        $this->isAdmin = $isAdmin;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        $subject = $this->isAdmin ? "Admin: Investment {$this->status}" : "Investment {$this->status}";
        $message = (new MailMessage)
            ->subject($subject)
            ->line("The Investment #{$this->investment->id} has been {$this->status}.")
            ->line("Investment Amount: ₦{$this->investment->invest_amount}")
            ->line("Plan: {$this->investment->plan->name}");

        if ($this->isAdmin) {
            $message->action('View Details', url('/investments'));
        }

        return $message;
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'investment',
            'id' => $this->investment->id,
            'status' => $this->status,
            'is_admin' => $this->isAdmin,
        ];
    }
}
