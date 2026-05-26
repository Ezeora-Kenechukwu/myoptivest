import React, { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import InputLabel from "@/components/InputLabel";
import TextInput from "@/components/TextInput";
import InputError from "@/components/InputError";
import PrimaryButton from "@/components/PrimaryButton";
import Switch from "@/components/Switch";
import SearcheableSelectInput from "@/components/SearcheableSelectInput";

const ReferralSettingsForm = ({ type = "savings", referralSetting = null, update = false }) => {
  const [isDisabled, setIsDisabled] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    type: referralSetting?.type || type,
    is_active: referralSetting?.is_active ?? true,
    use_fixed_bonus: referralSetting?.use_fixed_bonus ?? true,
    fixed_bonus_amount: referralSetting?.fixed_bonus_amount || 5000,
    use_percentage_bonus: referralSetting?.use_percentage_bonus ?? false,
    percentage_bonus: referralSetting?.percentage_bonus || "",
    bonus_limit_per_referee: referralSetting?.bonus_limit_per_referee || 1,
    max_bonus_count: referralSetting?.max_bonus_count || null,

    enable_multi_tier: referralSetting?.enable_multi_tier ?? false,
    number_of_tiers: referralSetting?.number_of_tiers || 0,
    bonus_rate_tiers: referralSetting?.bonus_rate_tiers || [],

    enable_multi_downline: referralSetting?.enable_multi_downline ?? false,
    downline_levels: referralSetting?.downline_levels || 1,
    downline_percentages: referralSetting?.downline_percentages || [],
  });
//   bonus_limit_per_referee: setting?.bonus_limit_per_referee ?? 1,
//   downline_levels: setting?.downline_levels ?? 1,
//   downline_percentages: setting?.downline_percentages ?? [{ level: 1, percentage: 1 }],
//   bonus_rate_tiers: setting?.bonus_rate_tiers ?? [{ limit: 1, bonus: 5 }],
  useEffect(() => {
    setIsDisabled(!data.is_active);
  }, [data.is_active]);

  const addBonusRateTier = () => {
    setData("bonus_rate_tiers", [...data.bonus_rate_tiers, { limit: "", bonus: "" }]);
  };

  const addDownlinePercentage = () => {
    setData("downline_percentages", [...data.downline_percentages, { level: "", percentage: "" }]);
  };

  const submit = (e) => {
    e.preventDefault();
    const routeName = update ? "referral-settings.update" : "referral-settings.store";
    post(route('referral-settings.upsert'), {
      preserveScroll: true,
      onSuccess: () => reset(),
    });
  };

  const options1To20 = Array.from({ length: 20 }, (_, i) => ({ id: i + 1, name: String(i + 1) }));

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">
          {type === "savings" ? "Savings Referral Settings" : "Investment Referral Settings"}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{data.is_active ? "Enabled" : "Disabled"}</span>
          <Switch
            checked={data.is_active}
            onChange={(val) => setData("is_active", val)}
          />
        </div>
      </div>

      {/* Fixed Bonus Toggle */}
      <div>
        <InputLabel value="Use Fixed Bonus" />
        <Switch
          checked={data.use_fixed_bonus}
          disabled={isDisabled}
          onChange={(val) => {
            setData("use_fixed_bonus", val);
            if (val) {
              setData("use_percentage_bonus", false);
              setData("percentage_bonus", "");
            }
          }}
        />
        <p className="text-sm text-slate-500 mt-1">
          If enabled, a fixed amount will be paid per referral.
        </p>
      </div>

      {/* Fixed Bonus Amount */}
      {data.use_fixed_bonus && (
        <div>
          <InputLabel value="Fixed Bonus Amount (₦)" />
          <TextInput
            type="number"
            value={data.fixed_bonus_amount}
            onChange={(e) => setData("fixed_bonus_amount", e.target.value)}
            disabled={isDisabled}
            className="w-full py-3 px-5"
          />
          <InputError message={errors.fixed_bonus_amount} />
        </div>
      )}

      {/* Percentage Bonus Toggle */}
      <div>
        <InputLabel value="Use Percentage Bonus" />
        <Switch
          checked={data.use_percentage_bonus}
          disabled={isDisabled}
          onChange={(val) => {
            setData("use_percentage_bonus", val);
            if (val) {
              setData("use_fixed_bonus", false);
              setData("fixed_bonus_amount", "");
            }
          }}
        />
        <p className="text-sm text-slate-500 mt-1">
          If enabled, a percentage of the referred user's amount will be paid.
        </p>
      </div>

      {/* Percentage Bonus Field */}
      {data.use_percentage_bonus && (
        <div>
          <InputLabel value="Percentage Bonus (%)" />
          <TextInput
            type="number"
            value={data.percentage_bonus}
            onChange={(e) => setData("percentage_bonus", e.target.value)}
            disabled={isDisabled}
            className="w-full px-5 py-3"
          />
          <InputError message={errors.percentage_bonus} />
        </div>
      )}

      {/* Bonus Limit Per Referee */}
      <div>
        <InputLabel value="Bonus Limit per Referee" />
        <SearcheableSelectInput
          options={options1To20}
          defaultValue={data.bonus_limit_per_referee}
          onChange={(val) => setData("bonus_limit_per_referee", val[0])}
          disabled={isDisabled}
        />
        <p className="text-sm text-slate-500 mt-1">
          Max number of times you can earn from one referred user.
        </p>
      </div>
      {/* Bonus Limit Per Referee */}
      <div>
        <InputLabel value="Maximum number of bonus a user can earn In general" />
        <SearcheableSelectInput
          options={options1To20}
          defaultValue={data.max_bonus_count}
          onChange={(val) => setData("max_bonus_count", val[0])}
          disabled={isDisabled}
        />
        <p className="text-sm text-slate-500 mt-1">
          Max number of times a user can get a bonus from users he/she referred.
        </p>
      </div>





{/* Enable Multi Tier Switch */}
<div>
  <InputLabel value="Enable Multi-Tier Bonus" />
  <Switch
    checked={data.enable_multi_tier}
    onChange={(val) => {
      setData("enable_multi_tier", val);
      if (!val) {
        setData("number_of_tiers", 0);
        setData("bonus_rate_tiers", []);
      }
    }}
    disabled={isDisabled}
  />
</div>

{/* Show Tier Fields only if enabled */}
{data.enable_multi_tier && (
  <div className="space-y-4 border p-4 rounded ">
    <div>
      <InputLabel value="Number of Tiers" />
      <SearcheableSelectInput
        options={options1To20}
        defaultValue={data.number_of_tiers}
        onChange={(val) => {
          const tiers = parseInt(val[0]);
          setData("number_of_tiers", tiers);
          // Reset tier data based on selected count
          setData(
            "bonus_rate_tiers",
            Array.from({ length: tiers }, (_, i) => ({
              limit: i + 1,
              bonus: "",
            }))
          );
        }}
        disabled={isDisabled}
      />
    </div>

    {data.bonus_rate_tiers.length > 0 &&
      data.bonus_rate_tiers.map((tier, idx) => (
        <div className="flex gap-2 mb-2" key={idx}>
          <TextInput
            type="number"
            placeholder="Limit"
            value={tier.limit}
            onChange={(e) => {
              const updated = [...data.bonus_rate_tiers];
              updated[idx].limit = e.target.value;
              setData("bonus_rate_tiers", updated);
            }}
            disabled={isDisabled}
          />
          <TextInput
            type="number"
            placeholder="Bonus"
            value={tier.bonus}
            onChange={(e) => {
              const updated = [...data.bonus_rate_tiers];
              updated[idx].bonus = e.target.value;
              setData("bonus_rate_tiers", updated);
            }}
            disabled={isDisabled}
          />
        </div>
      ))}
  </div>
)}

{/* Enable Multi-Downline Switch */}
<div>
  <InputLabel value="Enable Multi-Downline Bonus" />
  <Switch
    checked={data.enable_multi_downline}
    onChange={(val) => {
      setData("enable_multi_downline", val);
      if (!val) {
        setData("downline_levels", 0);
        setData("downline_percentages", []);
      }
    }}
    disabled={isDisabled}
  />
</div>

{/* Show Downline Fields only if enabled */}
{data.enable_multi_downline && (
  <div className="space-y-4 border p-4 rounded ">
    <div>
      <InputLabel value="Downline Levels" />
      <SearcheableSelectInput
        options={options1To20}
        defaultValue={data.downline_levels}
        onChange={(val) => {
          const levels = parseInt(val[0]);
          setData("downline_levels", levels);
          setData(
            "downline_percentages",
            Array.from({ length: levels }, (_, i) => ({
              level: i + 1,
              percentage: "",
            }))
          );
        }}
        disabled={isDisabled}
      />
    </div>

    {data.downline_percentages.length > 0 &&
      data.downline_percentages.map((entry, idx) => (
        <div className="flex gap-2 mb-2" key={idx}>
          <TextInput
            type="number"
            placeholder="Level"
            value={entry.level}
            onChange={(e) => {
              const updated = [...data.downline_percentages];
              updated[idx].level = e.target.value;
              setData("downline_percentages", updated);
            }}
            disabled={isDisabled}
          />
          <TextInput
            type="number"
            placeholder="Percentage"
            value={entry.percentage}
            onChange={(e) => {
              const updated = [...data.downline_percentages];
              updated[idx].percentage = e.target.value;
              setData("downline_percentages", updated);
            }}
            disabled={isDisabled}
          />
        </div>
      ))}
  </div>
)}







      {/* Submit */}
      <div className="flex justify-end">
        <PrimaryButton disabled={processing}>
          {processing ? "Saving..." : update ? "Update Settings" : "Create Settings"}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default ReferralSettingsForm;
