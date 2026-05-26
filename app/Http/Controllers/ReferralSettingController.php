<?php

namespace App\Http\Controllers;

use App\Models\ReferralSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ReferralSettingController extends Controller
{
    public function index()
    {
        try {
            $settings = ReferralSetting::whereIn('type', ['investment', 'savings'])->get()->keyBy('type');

            return Inertia::render('RefererSetting/Index', [
                'settings' => $settings,
            ]);
        } catch (\Throwable $e) {
            Log::error('Failed to load referral settings', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->with('error', 'Could not load referral settings.');
        }
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'type' => 'required|in:savings,investment',
                'is_active' => 'required|boolean',

                'use_fixed_bonus' => 'required|boolean',
                'fixed_bonus_amount' => 'nullable|required_if:use_fixed_bonus,true|numeric|min:0',

                'use_percentage_bonus' => 'required|boolean',
                'percentage_bonus' => 'nullable|required_if:use_percentage_bonus,true|numeric|min:0|max:100',

                'bonus_limit_per_referee' => 'nullable|integer|min:0',

                'enable_multi_tier' => 'required|boolean',
                'bonus_rate_tiers' => 'nullable|array',

                'enable_multi_downline' => 'required|boolean',
                'downline_levels' => 'required|integer|min:0',
                'downline_fixed_rates' => 'nullable|array',
                'downline_percentage_rates' => 'nullable|array',
            ]);

            // Clear unused fields based on logic
            if (!$data['use_fixed_bonus']) {
                $data['fixed_bonus_amount'] = null;
            }

            if (!$data['use_percentage_bonus']) {
                $data['percentage_bonus'] = null;
            }

            if (!$data['enable_multi_tier']) {
                $data['bonus_rate_tiers'] = null;
            }

            if (!$data['enable_multi_downline']) {
                $data['downline_fixed_rates'] = null;
                $data['downline_percentage_rates'] = null;
            }

            $setting = ReferralSetting::updateOrCreate(
                ['type' => $data['type']],
                array_merge($data, [
                    'slug' => ReferralSetting::where('type', $data['type'])->value('slug') ?? Str::slug($data['type'] . '-' . Str::uuid()),
                ])
            );

            return redirect()->back()->with('success', ucfirst($data['type']) . ' referral settings saved.');
        } catch (\Throwable $e) {
            Log::error('Failed to save referral setting', [
                'message' => $e->getMessage(),
                'input' => $request->all(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Could not save referral settings.');
        }
    }

}

