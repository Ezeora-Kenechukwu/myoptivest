<?php

namespace App\Http\Controllers;

use App\Models\Saving;
use App\Services\DailySavingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Exception;

class DailySavingController extends Controller
{
    protected $dailySavingService;

    public function __construct(DailySavingService $dailySavingService)
    {
        $this->dailySavingService = $dailySavingService;
    }

    public function store(Request $request, Saving $saving)
    {
        try {
            // Validate that the saving exists and is not cancelled
            if ($saving->status === 'cancelled') {
                throw new Exception('Cannot contribute to a cancelled saving.');
            }

            // Authorize: User must own the saving or be a marketer
            if ($saving->user_id !== Auth::id() && !Auth::user()->hasRole('marketer')) {
                throw new Exception('Unauthorized to process this contribution.');
            }

            // Process the manual contribution
            $contribution = $this->dailySavingService->processManualContribution($saving, Auth::user(), Auth::user());

            return back()->with('success', 'Contribution processed successfully.');
        } catch (Exception $e) {
            Log::error('Failed to process manual contribution in controller', [
                'user_id' => Auth::id(),
                'saving_id' => $saving->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return back()->with('error', $e->getMessage());
        }
    }
}
