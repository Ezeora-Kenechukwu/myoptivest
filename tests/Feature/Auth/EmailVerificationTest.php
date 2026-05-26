<?php

use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\URL;

test('email verification screen can be rendered', function () {
    $user = User::factory()->unverified()->create();

    $response = $this->actingAs($user)->get('/verify-email');

    $response->assertStatus(200);
});

test('unverified normal users are sent to email verification middleware', function () {
    $user = User::factory()->unverified()->create(['type' => 'user']);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertRedirect(route('verification.notice'));
});

test('unverified admins bypass email verification middleware', function () {
    $admin = User::factory()->unverified()->create(['type' => 'admin']);

    $this->actingAs($admin)
        ->get(route('dashboard'))
        ->assertOk();

    $this->actingAs($admin)
        ->get(route('verification.notice'))
        ->assertRedirect(route('dashboard', absolute: false));
});

test('unverified staff bypass email verification middleware', function () {
    $staff = User::factory()->unverified()->create(['type' => 'staff']);

    $this->actingAs($staff)
        ->get(route('dashboard'))
        ->assertOk();

    $this->actingAs($staff)
        ->get(route('verification.notice'))
        ->assertRedirect(route('dashboard', absolute: false));
});

test('email can be verified', function () {
    $user = User::factory()->unverified()->create();

    Event::fake();

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => sha1($user->email)]
    );

    $response = $this->actingAs($user)->get($verificationUrl);

    Event::assertDispatched(Verified::class);
    expect($user->fresh()->hasVerifiedEmail())->toBeTrue();
    $response->assertRedirect(route('dashboard', absolute: false).'?verified=1');
});

test('email is not verified with invalid hash', function () {
    $user = User::factory()->unverified()->create();

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => sha1('wrong-email')]
    );

    $this->actingAs($user)->get($verificationUrl);

    expect($user->fresh()->hasVerifiedEmail())->toBeFalse();
});
