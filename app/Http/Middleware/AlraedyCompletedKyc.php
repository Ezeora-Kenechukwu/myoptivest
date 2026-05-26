<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AlraedyCompletedKyc
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
   public function handle($request, Closure $next)
{
    $user = $request->user();
// dd($user->kyc);
    // Only apply to normal users
    if ($user->type === 'user' && $user->kyc) {
        return redirect()->route('dashboard'); // your route to complete KYC
    }

    return $next($request);
}

}
