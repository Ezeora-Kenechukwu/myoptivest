<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\ProcessAutomaticContributions;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
         $middleware->validateCsrfTokens(except: [
            'webhook',                // matches POST /webhook
            'monnify/webhook',       // also matches nested route
            'monnify/webhook/*',       // also matches nested route
        ]);
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);
        $middleware->alias([

            'permission' => \App\Http\Middleware\CheckPermissionAbility::class,
             'admin' => \App\Http\Middleware\EnsureAdmin::class,
            'kyc' => \App\Http\Middleware\EnsureKycIsCompleted::class,
            'guestkyc' => \App\Http\Middleware\AlraedyCompletedKyc::class,
            'verified' => \App\Http\Middleware\EnsureUserEmailIsVerified::class,
        ]);
        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            ProcessAutomaticContributions::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
