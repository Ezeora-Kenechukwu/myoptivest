<?php

namespace App\Mail;

use App\Models\Loan;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class LoanStatusUpdated extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Loan $loan,
        public string $status,
        public bool $adminCopy = false,
        public ?float $amount = null,
        public ?string $reason = null,
    ) {}

    public function build()
    {
        return $this->subject('Loan ' . ucfirst(str_replace('_', ' ', $this->status)) . ' Update')
            ->markdown($this->adminCopy ? 'emails.loan-status-admin' : 'emails.loan-status-user')
            ->with([
                'loan' => $this->loan,
                'status' => $this->status,
                'amount' => $this->amount,
                'reason' => $this->reason,
            ]);
    }
}
