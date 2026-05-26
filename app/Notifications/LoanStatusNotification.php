<?php

namespace App\Notifications;

use App\Models\Loan;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LoanStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

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

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        $subject = $this->isAdmin ? "Admin: Loan {$this->status}" : "Loan {$this->status}";
        $message = (new MailMessage)->subject($subject);

        $statusMessages = [
            'requested' => "Your loan request of ₦{$this->loan->amount} has been submitted.",
            'approved' => "Your loan of ₦{$this->loan->amount} has been approved.",
            'rejected' => "Your loan request of ₦{$this->loan->amount} has been rejected.",
            'disbursed' => "Your loan of ₦{$this->loan->amount} has been disbursed.",
            'cancelled' => "Your loan request of ₦{$this->loan->amount} has been cancelled.",
            'repaid' => "Loan repayment of ₦{$this->amount} processed successfully.",
            'overdue' => "Loan repayment of ₦{$this->amount} is overdue.",
            'manual_payment' => "Manual loan payment of ₦{$this->amount} processed successfully.",
            'fully_repaid' => "Your loan of ₦{$this->loan->amount} has been fully repaid.",
        ];

        $message->line($statusMessages[$this->status] ?? "The Loan #{$this->loan->id} has been {$this->status}.");
        $message->line("Loan Amount: ₦{$this->loan->amount}");
        $message->line("Plan: {$this->loan->loanPlan->name}");

        if ($this->isAdmin) {
            $message->action('View Details', url('/admin/loans'));
        }

        return $message;
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'loan',
            'id' => $this->loan->id,
            'status' => $this->status,
            'amount' => $this->amount,
            'is_admin' => $this->isAdmin,
        ];
    }
}
