<?php

namespace App\Mail;

use App\Models\Payout;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PayoutProcessed extends Mailable
{
    use Queueable, SerializesModels;

    public $payout;

    public function __construct(Payout $payout)
    {
        $this->payout = $payout;
    }

    public function build()
    {
        return $this->subject('Payout Processed')
                    ->view('emails.payout-processed')
                    ->with(['payout' => $this->payout]);
    }
}
