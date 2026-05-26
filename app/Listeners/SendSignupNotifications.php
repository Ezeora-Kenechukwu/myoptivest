<?php
namespace App\Listeners;

use App\Events\UserSignedUp;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendSignupNotifications implements ShouldQueue
{
    use InteractsWithQueue;

  public function handle(UserSignedUp $event)
{
    $user = $event->user;

    // 🔑 send Laravel’s default verification email
    $user->sendEmailVerificationNotification();

    // Send welcome email (optional)
    Mail::to($user->email)->send(new \App\Mail\WelcomeMail($user));

    // Notify admins
    $admins = User::where('type', 'admin')->pluck('email');
    foreach ($admins as $adminEmail) {
        Mail::to($adminEmail)->send(new \App\Mail\NewUserNotification($user));
    }
}
}
