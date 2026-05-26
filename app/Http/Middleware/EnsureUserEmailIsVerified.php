<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserEmailIsVerified
{
    public function handle(Request $request, Closure $next, ?string $redirectToRoute = null): Response
    {
        $user = $request->user();

        if (!$user) {
            return $next($request);
        }

        if (method_exists($user, 'requiresEmailVerification') && !$user->requiresEmailVerification()) {
            return $next($request);
        }

        if ($user instanceof MustVerifyEmail && !$user->hasVerifiedEmail()) {
            if ($request->expectsJson()) {
                abort(403, 'Your email address is not verified.');
            }

            return redirect()->guest(route($redirectToRoute ?: 'verification.notice'));
        }

        return $next($request);
    }
}
