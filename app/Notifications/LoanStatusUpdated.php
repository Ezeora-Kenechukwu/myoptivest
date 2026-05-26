<?php

namespace App\Mail;

use App\Models\Loan;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class LoanStatusUpdated extends Mailable
{
    use Queueable, SerializesModels;

    public $loan;
    public $status;
    public $isAdmin;
    public $amount;
    public $reason;

    public function __construct(Loan $loan, $status, $isAdmin = false, $amount = null, $reason = null)
    {
        $this->loan = $loan;
        $this->status = $status;
        $this->isAdmin = $isAdmin;
        $this->amount = $amount;
        $this->reason = $reason;
    }

    public function build()
    {
        $subject = $this->isAdmin
            ? "Loan {$this->status} Notification (Loan ID: {$this->loan->id})"
            : "Your Loan {$this->status} Update";

        $view = $this->isAdmin ? 'emails.loan-status-admin' : 'emails.loan-status-user';

        return $this->subject($subject)
                    ->view($view)
                    ->with([
                        'loan' => $this->loan,
                        'status' => $this->status,
                        'amount' => $this->amount,
                        'reason' => $this->reason,
                    ]);
    }
}
