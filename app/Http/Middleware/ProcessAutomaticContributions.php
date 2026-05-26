<?php

namespace App\Http\Middleware;

use App\Services\DailySavingService;
use Carbon\Carbon;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ProcessAutomaticContributions
{
    protected $dailySavingService;

    public function __construct(DailySavingService $dailySavingService)
    {
        $this->dailySavingService = $dailySavingService;
    }

    public function handle(Request $request, Closure $next)
    {
        $cacheKey = 'last_automatic_contribution_run';
        $lastRun = Cache::get($cacheKey);

        if (!$lastRun || Carbon::parse($lastRun)->addHour()->isPast()) {
            $this->dailySavingService->processAutomaticContributions();
            Cache::put($cacheKey, Carbon::now()->toDateTimeString(), now()->addHours(1));
        }

        return $next($request);
    }
}
