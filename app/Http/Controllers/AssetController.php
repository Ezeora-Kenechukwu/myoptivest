<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use App\Models\AssetCategory;
use App\Models\Position;
use App\Models\PriceHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
class AssetController extends Controller
{
    public function __construct()
    {
        // $this->authorizeResource(Asset::class);
    }

    public function index()
    {
        try {
            $assets = Asset::with('category')->get();
            return Inertia::render('Admin/Assets/Index', ['assets' => $assets]);
        } catch (\Exception $e) {
            Log::error('Error fetching assets: ' . $e->getMessage());
            return back()->with('error', 'Failed to load assets. Please try again.');
        }
    }



    public function userindex()
    {
        try {
            $assets = Asset::with('category')->get();
            return Inertia::render('User/Assets/Index', ['assets' => $assets]);
        } catch (\Exception $e) {
            Log::error('Error fetching assets: ' . $e->getMessage());
            return back()->with('error', 'Failed to load assets. Please try again.');
        }
    }

    public function create()
    {
        $categories = AssetCategory::all();
        return Inertia::render('Admin/Assets/Create', ['categories' => $categories]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'category_id' => 'required|exists:asset_categories,id',
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'min_price' => 'required|numeric|min:0',
                'max_price' => 'required|numeric|gt:min_price',
            ]);

            $asset = Asset::create($validated + [
                'current_price' => ($validated['min_price'] + $validated['max_price']) / 2,
                'drift' => (rand(0, 1) ? 0.01 : -0.01),
            ]);

            return redirect()->route('admin.assets.index')->with('success', 'Asset created successfully.');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            Log::error('Error creating asset: ' . $e->getMessage());
            return back()->with('error', 'Failed to create asset. Please try again.');
        }
    }

    public function edit(Asset $asset)
    {
        $categories = AssetCategory::all();
        return Inertia::render('Admin/Assets/Edit', ['asset' => $asset, 'categories' => $categories]);
    }

public function usershow(Asset $asset)
{


    try {
        $asset->load('category');
        $history = $asset->priceHistories()->latest()->limit(100)->get(['price', 'timestamp']);
        return Inertia::render('User/Assets/Show', ['asset' => $asset, 'history' => $history]);
    } catch (\Exception $e) {
        Log::error('Error showing asset: ' . $e->getMessage());
        return back()->with('error', 'Failed to load asset details. Please try again.');
    }
}
    public function update(Request $request, Asset $asset)
    {
        try {
            $validated = $request->validate([
                'category_id' => 'sometimes|exists:asset_categories,id',
                'name' => 'sometimes|string|max:255',
                'description' => 'nullable|string',
                'min_price' => 'sometimes|numeric|min:0',
                'max_price' => 'sometimes|numeric|gt:min_price',
            ]);

            $asset->update($validated);

            if (isset($validated['min_price']) || isset($validated['max_price'])) {
                $min = $validated['min_price'] ?? $asset->min_price;
                $max = $validated['max_price'] ?? $asset->max_price;
                if ($asset->current_price < $min) $asset->current_price = $min;
                if ($asset->current_price > $max) $asset->current_price = $max;
                $asset->save();
            }

            broadcast(new \App\Events\PriceUpdated($asset));

            return redirect()->route('admin.assets.index')->with('success', 'Asset updated successfully.');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            Log::error('Error updating asset: ' . $e->getMessage());
            return back()->with('error', 'Failed to update asset. Please try again.');
        }
    }

    public function destroy(Asset $asset)
    {
        try {
            $asset->delete();
            return redirect()->route('admin.assets.index')->with('success', 'Asset deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Error deleting asset: ' . $e->getMessage());
            return back()->with('error', 'Failed to delete asset. Please try again.');
        }
    }

 public function purchase(Request $request, Asset $asset)
    {


        try {
            $validated = $request->validate([
                'units' => 'required|numeric|min:0.01',
            ]);

            // Begin transaction (to keep wallet update + position creation atomic)
            return DB::transaction(function () use ($asset, $validated) {
                // Lock the asset to prevent race conditions on price changes
                $lockedAsset = Asset::lockForUpdate()->find($asset->id);
                $currentPrice = $lockedAsset->current_price;

                // Calculate total cost
                $totalCost = $validated['units'] * $currentPrice;

                // Get authenticated user with wallet
                $user = Auth::user(); // Lock user row as well
                $wallet = $user->wallet; // Assuming you have a `wallet` column
// dd($totalCost, $wallet, $user);
                // Check if wallet has sufficient funds
                if ($wallet < $totalCost) {
                    throw new \Exception('Insufficient funds. Please fund your wallet and try again.');
                }

                // Deduct funds from wallet
                $user->decrement('wallet', $totalCost);

                // Create the position
                $position = Position::create([
                    'user_id'        => $user->id,
                    'asset_id'       => $lockedAsset->id,
                    'units'          => $validated['units'],
                    'purchase_price' => $currentPrice,
                    'purchased_at'   => now(),
                    'status'         => 'active',
                ]);

                // Log transaction
                Log::info('Asset purchase completed', [
                    'user_id'    => $user->id,
                    'asset_id'   => $lockedAsset->id,
                    'units'      => $validated['units'],
                    'price'      => $currentPrice,
                    'total_cost' => $totalCost,
                    'position_id'=> $position->id,
                    'new_wallet_balance' => $user->wallet,
                ]);

                return redirect()
                    ->route('user.positions.index')
                    ->with('success', "Asset purchased successfully! Total cost: ₦{$totalCost}");
            });

        } catch (ValidationException $e) {
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            Log::error('Error purchasing asset: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'asset_id' => $asset->id,
                'units' => $validated['units'] ?? null,
            ]);
            return back()->with('error', $e->getMessage());
        }
    }
}
