<?php

namespace App\Console\Commands;

use App\Models\Loan;
use Illuminate\Console\Command;

class ProcessLoanRepayments extends Command
{
    protected $signature = 'loans:process-repayments';
    protected $description = 'Process pending and overdue loan repayments';

    public function handle()
    {
        $loans = Loan::where('status', 'disbursed')->get();
        foreach ($loans as $loan) {
            $loan->processRepayments();
        }
        $this->info('Loan repayments processed successfully.');
    }
}
