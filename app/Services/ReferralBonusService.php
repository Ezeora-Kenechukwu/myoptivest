<?php

namespace App\Services;

use App\Models\ReferralBonus;
use App\Models\ReferralSetting;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ReferralBonusService
{
    public function handle(string $type, User $referredUser, float $amount, string $sourceType, int $sourceId): void
    {
        if (!$referredUser->referrer) return;

        try {
            $setting = ReferralSetting::where('type', $type)
                ->where('is_active', true)
                ->first();

            if (!$setting) return;

            $referrer = $referredUser->referrer;

            for ($level = 1; $level <= $setting->downline_levels && $referrer; $level++) {

                if (!$referrer->canReceiveBonus($type)) break;

                if ($this->hasReachedBonusLimit($referrer->id, $referredUser->id, $type, $setting)) break;

                $bonusAmount = $this->calculateBonusAmount($setting, $level, $amount);

                if ($bonusAmount <= 0) break;

                DB::transaction(function () use ($referrer, $referredUser, $type, $bonusAmount, $level, $sourceType, $sourceId, $setting) {
                    $bonus = ReferralBonus::create([
                        'referrer_id' => $referrer->id,
                        'referred_id' => $referredUser->id,
                        'type' => $type,
                        'amount' => $bonusAmount,
                        'level' => $level,
                        'referral_setting_id' => $setting->id,
                        'source_type' => $sourceType,
                        'source_id' => $sourceId,
                        'slug' => Str::uuid(),
                    ]);

                    $referrer->increment("{$type}_balance", $bonusAmount);

                    // You can dispatch an event here if needed
                    // ReferralBonusCreated::dispatch($bonus);
                });

                $referrer = $referrer->referrer;
            }

        } catch (\Throwable $e) {
            Log::error("Referral bonus processing failed", [
                'message' => $e->getMessage(),
                'type' => $type,
                'referred_user_id' => $referredUser->id,
                'amount' => $amount,
                'source_id' => $sourceId,
            ]);
        }
    }

    protected function calculateBonusAmount(ReferralSetting $setting, int $level, float $amount): float
    {
        // Use fixed bonus logic
        if ($setting->use_fixed_bonus) {
            // Multi-tier logic
            if ($setting->enable_multi_tier && $level === 1 && is_array($setting->bonus_rate_tiers)) {
                foreach ($setting->bonus_rate_tiers as $tier) {
                    if ($tier['limit'] >= 1) {
                        return $tier['bonus']; // First matching tier
                    }
                }
            }

            // Downline fixed rates
            if ($setting->enable_multi_downline && $level > 1 && is_array($setting->downline_fixed_rates)) {
                return $setting->downline_fixed_rates[$level] ?? 0;
            }

            // Default fixed amount for first level
            return $level === 1 ? ($setting->fixed_bonus_amount ?? 0) : 0;
        }

        // Use percentage bonus logic
        if ($setting->use_percentage_bonus) {
            if ($level === 1) {
                return ($setting->percentage_bonus / 100) * $amount;
            }

            if ($setting->enable_multi_downline && is_array($setting->downline_percentage_rates)) {
                $percentage = $setting->downline_percentage_rates[$level] ?? 0;
                return ($percentage / 100) * $amount;
            }
        }

        return 0;
    }

    protected function hasReachedBonusLimit(int $referrerId, int $referredId, string $type, ReferralSetting $setting): bool
    {
        if (!$setting->bonus_limit_per_referee) return false;

        $count = ReferralBonus::where('referrer_id', $referrerId)
            ->where('referred_id', $referredId)
            ->where('type', $type)
            ->count();

        return $count >= $setting->bonus_limit_per_referee;
    }
}
    //   {/* Bonus Rate Tiers (Repeating) */}
    //   <div>
    //     <InputLabel value="Bonus Rate Tiers (Optional)" />
    //     {data.bonus_rate_tiers.map((tier, idx) => (
    //       <div className="flex gap-2 mb-2" key={idx}>
    //         <TextInput
    //           type="number"
    //           placeholder="Limit"
    //           value={tier.limit}
    //           onChange={(e) => {
    //             const copy = [...data.bonus_rate_tiers];
    //             copy[idx].limit = e.target.value;
    //             setData("bonus_rate_tiers", copy);
    //           }}
    //           disabled={isDisabled}
    //         />
    //         <TextInput
    //           type="number"
    //           placeholder="Bonus"
    //           value={tier.bonus}
    //           onChange={(e) => {
    //             const copy = [...data.bonus_rate_tiers];
    //             copy[idx].bonus = e.target.value;
    //             setData("bonus_rate_tiers", copy);
    //           }}
    //           disabled={isDisabled}
    //         />
    //       </div>
    //     ))}
    //     <button
    //       type="button"
    //       onClick={addBonusRateTier}
    //       className="text-sm text-blue-600 hover:underline"
    //       disabled={isDisabled}
    //     >
    //       + Add Tier
    //     </button>
    //     <p className="text-sm text-slate-500 mt-1">
    //       Define different bonus amounts based on referral count.
    //     </p>
    //   </div>

    //   {/* Downline Levels */}
    //   <div>
    //     <InputLabel value="Downline Levels" />
    //     <SearcheableSelectInput
    //       options={options1To20}
    //       defaultValue={data.downline_levels}
    //       onChange={(val) => setData("downline_levels", val[0])}
    //       disabled={isDisabled}
    //     />
    //     <p className="text-sm text-slate-500 mt-1">
    //       Number of referral generations to reward (e.g., 2 = children + grandchildren).
    //     </p>
    //   </div>

    //   {/* Downline Percentages */}
    //   <div>
    //     <InputLabel value="Downline Percentages (%)" />
    //     {data.downline_percentages.map((entry, idx) => (
    //       <div className="flex gap-2 mb-2" key={idx}>
    //         <TextInput
    //           type="number"
    //           placeholder="Level"
    //           value={entry.level}
    //           onChange={(e) => {
    //             const updated = [...data.downline_percentages];
    //             updated[idx].level = e.target.value;
    //             setData("downline_percentages", updated);
    //           }}
    //           disabled={isDisabled}
    //         />
    //         <TextInput
    //           type="number"
    //           placeholder="Percentage"
    //           value={entry.percentage}
    //           onChange={(e) => {
    //             const updated = [...data.downline_percentages];
    //             updated[idx].percentage = e.target.value;
    //             setData("downline_percentages", updated);
    //           }}
    //           disabled={isDisabled}
    //         />
    //       </div>
    //     ))}
    //     <button
    //       type="button"
    //       onClick={addDownlinePercentage}
    //       className="text-sm text-blue-600 hover:underline"
    //       disabled={isDisabled}
    //     >
    //       + Add Downline
    //     </button>
    //     <p className="text-sm text-slate-500 mt-1">
    //       Set bonus percentages for each referral level.
    //     </p>
    //   </div>
