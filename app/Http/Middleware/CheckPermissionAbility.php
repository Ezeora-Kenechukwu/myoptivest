<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class CheckPermissionAbility
{
    public function handle(Request $request, Closure $next, string $permission, ?string $ability = null): Response
    {
        $user = $request->user();

        if (!$user) {
            return $this->forbiddenResponse($request, 'Unauthorized');
        }

        $ability = $ability ?: 'can_' . Str::snake($request->route()?->getActionMethod() ?: 'index');

        if (!method_exists($user, 'hasPermissionTo') || !$user->hasPermissionTo($permission, $ability)) {
            return $this->forbiddenResponse($request, 'Forbidden');
        }

        return $next($request);
    }

    protected function forbiddenResponse(Request $request, string $message = 'Forbidden'): Response
    {
        if ($request->expectsJson()) {
            abort(403, $message);
        }

        return redirect()->route('dashboard')->with('error', $message);
    }
}
