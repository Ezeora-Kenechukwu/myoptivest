<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
Schedule::command('investments:process-returns')
    ->everyTenMinutes()
    ->withoutOverlapping(); // Prevent overlapping execution
Schedule::command('loans:process-repayments')->daily();
// Schedule::command('loans:process-repayments')->everyMinute();

