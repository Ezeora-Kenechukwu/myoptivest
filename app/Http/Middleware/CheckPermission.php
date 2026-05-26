<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    public function handle(Request $request, Closure $next, string $permission, ?string $ability = null): Response
    {
        $user = $request->user();

        if (!$user) {
            return $this->deny($request, 'Unauthorized');
        }

        $ability = $ability ?: 'can_' . Str::snake($request->route()?->getActionMethod() ?: 'index');

        if (!method_exists($user, 'hasPermissionTo') || !$user->hasPermissionTo($permission, $ability)) {
            return $this->deny($request, 'Forbidden: You do not have permission to access this resource.');
        }

        return $next($request);
    }

    private function deny(Request $request, string $message): Response
    {
        if ($request->expectsJson()) {
            abort(403, $message);
        }

        return redirect()->route('dashboard')->with('error', $message);
    }
}
