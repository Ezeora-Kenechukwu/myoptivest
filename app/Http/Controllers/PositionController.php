<?php

namespace App\Http\Controllers;

use App\Events\SellRequested;
use App\Http\Controllers\Controller;
use App\Models\Asset;
use App\Models\Position;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class PositionController extends Controller
{

    public function pendingSells()
    {


        try {
            $pending = Position::with(['user', 'asset'])
                ->where('status', 'pending_sell')
                ->orderBy('sell_requested_at', 'desc')
                ->paginate(15);

            return Inertia::render('Admin/Positions/PendingSells', ['pending' => $pending]);
        } catch (\Exception $e) {
            Log::error('Error fetching pending sells: ' . $e->getMessage());
            return back()->with('error', 'Failed to load pending sells. Please try again.');
        }
    }

    public function approveSell(Position $position)
    {


        try {
            // Lock position for update
            $position->lockForUpdate()->get();

            // Check if position is still pending sell
            if ($position->status !== 'pending_sell') {
                return back()->with('error', 'Position status has changed. Please refresh the page.');
            }

            $sellPrice = $position->sell_requested_price;
            $totalPayout = $position->units * $sellPrice;

            // Update position status to sold
            $position->update([
                'status' => 'sold',
                'sold_at' => now(),
                'sold_price' => $sellPrice,
                'buyer_id' => null, // Company as buyer
            ]);

            // Process payout to user (implement your payment logic)
            // $user = $position->user;
            // $user->increment('balance', $totalPayout);

            // Log the approval
            Log::info('Sell request approved', [
                'position_id' => $position->id,
                'admin_id' => Auth::id(),
                'user_id' => $position->user_id,
                'asset_id' => $position->asset_id,
                'units' => $position->units,
                'sell_price' => $sellPrice,
                'total_payout' => $totalPayout,
            ]);

            // Optional: Notify user of approval
            // $position->user->notify(new SellRequestApprovedNotification($position));

            return redirect()->route('admin.positions.pending-sells')->with('success', "Sell approved! Payout: ${$totalPayout}");

        } catch (\Exception $e) {
            Log::error('Error approving sell: ' . $e->getMessage(), [
                'position_id' => $position->id,
                'admin_id' => Auth::id(),
            ]);
            return back()->with('error', 'Failed to approve sell. Please try again.');
        }
    }

    public function declineSell(Position $position)
    {


        try {
            // Lock position for update
            $position->lockForUpdate()->get();

            // Check if position is still pending sell
            if ($position->status !== 'pending_sell') {
                return back()->with('error', 'Position status has changed. Please refresh the page.');
            }

            // Reset position to active
            $position->update([
                'status' => 'active',
                'sell_requested_at' => null,
                'sell_requested_price' => null,
            ]);

            // Log the decline
            Log::info('Sell request declined', [
                'position_id' => $position->id,
                'admin_id' => Auth::id(),
                'user_id' => $position->user_id,
                'asset_id' => $position->asset_id,
                'units' => $position->units,
            ]);

            // Optional: Notify user of decline
            // $position->user->notify(new SellRequestDeclinedNotification($position));

            return redirect()->route('admin.positions.pending-sells')->with('success', 'Sell request declined.');

        } catch (\Exception $e) {
            Log::error('Error declining sell: ' . $e->getMessage(), [
                'position_id' => $position->id,
                'admin_id' => Auth::id(),
            ]);
            return back()->with('error', 'Failed to decline sell. Please try again.');
        }
    }

    /**
     * Get pending sells data for DataTable (optional for AJAX)
     */
    public function getPendingSellsData(Request $request)
    {


        try {
            $query = Position::with(['user', 'asset'])
                ->where('status', 'pending_sell');

            if ($request->has('search')) {
                $search = $request->get('search');
                $query->where(function($q) use ($search) {
                    $q->whereHas('user', function($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%");
                    })->orWhereHas('asset', function($assetQuery) use ($search) {
                        $assetQuery->where('name', 'like', "%{$search}%");
                    });
                });
            }

            if ($request->has('order')) {
                $order = $request->get('order');
                $direction = $request->get('direction', 'asc');
                $query->orderBy($order, $direction);
            }

            $pending = $query->paginate($request->get('per_page', 15));

            return response()->json([
                'data' => $pending->items(),
                'current_page' => $pending->currentPage(),
                'last_page' => $pending->lastPage(),
                'per_page' => $pending->perPage(),
                'total' => $pending->total(),
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching pending sells data: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to load data'], 500);
        }
    }
    public function index()
{
    try {
        $positions = Position::with('asset')->where('user_id', Auth::id())->paginate(10);
        $positions->getCollection()->transform(function ($position) {
            $position->current_price = $position->asset->current_price;
            $position->asset_id = $position->asset->id;
            return $position;
        });
        return Inertia::render('User/Positions/Index', ['positions' => $positions]);
    } catch (\Exception $e) {
        Log::error('Error fetching positions: ' . $e->getMessage());
        return back()->with('error', 'Failed to load positions. Please try again.');
    }
}

public function show(Position $position)
    {


        try {
            $position->load('asset', 'buyer');
            $position->current_price = $position->asset->current_price;
            return Inertia::render('User/Positions/Show', ['position' => $position]);
        } catch (\Exception $e) {
            Log::error('Error showing position: ' . $e->getMessage());
            return back()->with('error', 'Failed to load position details. Please try again.');
        }
    }

public function transfer(Request $request, Position $position)
{
    // $this->authorize('transfer', $position);

    try {
        $validated = $request->validate([
            'optivest_id' => 'required|string|exists:users,optivest_id',
        ]);

        $buyer = User::where('optivest_id', $validated['optivest_id'])->firstOrFail();

        // Check if buyer is not the same user
        if ($buyer->id === Auth::id()) {
            throw ValidationException::withMessages(['optivest_id' => 'Cannot transfer to yourself']);
        }

        // Use database transaction with proper locking
        return DB::transaction(function () use ($position, $buyer, $validated) {
            // Lock the position row for update
            $lockedPosition = Position::lockForUpdate()->find($position->id);

            // Check if position is still active
            if ($lockedPosition->status !== 'active') {
                throw ValidationException::withMessages(['optivest_id' => 'Position is no longer available for transfer']);
            }

            // Lock the asset to get current price
            $lockedAsset = Asset::lockForUpdate()->find($lockedPosition->asset_id);
            $currentPrice = $lockedAsset->current_price;
            $transferValue = $lockedPosition->units * $currentPrice;

            // Lock both seller and buyer wallets
            $seller = Auth::user()->lockForUpdate()->first();
            $buyerLocked = $buyer->lockForUpdate()->first();

            // For P2P transfer, you might want to:
            // 1. Deduct from seller's wallet (if you want to record the transfer financially)
            // 2. Add to buyer's wallet
            // OR
            // 3. Just transfer ownership without wallet movement (if it's just ownership transfer)

            // Option 1: Financial transfer (uncomment if needed)
            /*
            if ($seller->wallet < $transferValue) {
                throw new \Exception('Insufficient funds for transfer. Please fund your wallet.');
            }

            $seller->decrement('wallet', $transferValue);
            $buyerLocked->increment('wallet', $transferValue);
            */

            // Update position ownership
            $lockedPosition->update([
                'user_id' => $buyer->id,
                'buyer_id' => $buyer->id,
                'status' => 'transferred',
                'sold_at' => now(),
                'sold_price' => $currentPrice,
            ]);

            // Log the transfer
            Log::info('Asset transfer completed', [
                'position_id' => $lockedPosition->id,
                'from_user_id' => $seller->id,
                'to_user_id' => $buyer->id,
                'asset_id' => $lockedPosition->asset_id,
                'units' => $lockedPosition->units,
                'transfer_value' => $transferValue,
                'optivest_id' => $validated['optivest_id'],
                'seller_new_balance' => $seller->wallet,
                'buyer_new_balance' => $buyerLocked->wallet,
            ]);

            return redirect()
                ->route('user.positions.index')
                ->with('success', "Asset transferred successfully! Transfer value: ₦{$transferValue}");
        });

    } catch (ValidationException $e) {
        return back()->withErrors($e->errors());
    } catch (\Exception $e) {
        Log::error('Error transferring position: ' . $e->getMessage(), [
            'position_id' => $position->id,
            'user_id' => Auth::id(),
        ]);
        return back()->with('error', $e->getMessage());
    }
}
  public function requestSell(Position $position)
{
    // $this->authorize('requestSell', $position);

    try {
        // Use database transaction with proper locking
        return DB::transaction(function () use ($position) {
            // Lock the position row for update
            $lockedPosition = Position::lockForUpdate()->find($position->id);

            // Check if position is still active
            if ($lockedPosition->status !== 'active') {
                throw new \Exception('Position is no longer available for selling.');
            }

            // Lock the asset to get current price
            $lockedAsset = Asset::lockForUpdate()->find($lockedPosition->asset_id);
            $currentPrice = $lockedAsset->current_price;
            $totalValue = $lockedPosition->units * $currentPrice;

            // Update position status to pending sell
            $lockedPosition->update([
                'status' => 'pending_sell',
                'sell_requested_at' => now(),
                'sell_requested_price' => $currentPrice,
            ]);

            // Log the sell request
            Log::info('Sell request submitted', [
                'position_id' => $lockedPosition->id,
                'user_id' => Auth::id(),
                'asset_id' => $lockedPosition->asset_id,
                'units' => $lockedPosition->units,
                'requested_price' => $currentPrice,
                'total_value' => $totalValue,
            ]);

            return redirect()
                ->route('user.positions.index')
                ->with('success', "Sell request submitted! Requested value: ₦{$totalValue}");
        });

    } catch (\Exception $e) {
        Log::error('Error requesting sell: ' . $e->getMessage(), [
            'position_id' => $position->id,
            'user_id' => Auth::id(),
        ]);
        return back()->with('error', $e->getMessage());
    }
}



}
