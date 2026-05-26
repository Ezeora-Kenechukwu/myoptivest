<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class WalletFundedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $amount;
    public $reference;

    public function __construct($user, $amount, $reference)
    {
        $this->user = $user;
        $this->amount = $amount;
        $this->reference = $reference;
    }

    public function build()
    {
        return $this->subject('Wallet Funded Successfully')
            ->markdown('emails.wallet.funded');
    }
}
