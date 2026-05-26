<?php

namespace App\Listeners;

use App\Events\SellRequested;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Notifications\SellRequestNotification;
use App\Models\User;
use Illuminate\Support\Facades\Notification;

class SendSellRequestNotification
{
    public function handle(SellRequested $event): void
    {
        // Get admins
        $admins = User::where('is_admin', true)->get(); // Assume is_admin flag

        Notification::send($admins, new SellRequestNotification($event->position));

        // Also database notification, email handled in Notification class
    }
}
