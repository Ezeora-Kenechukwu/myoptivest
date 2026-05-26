
import { Head, useForm } from "@inertiajs/react";

import InputLabel from "@/components/InputLabel";
import TextInput from "@/components/TextInput";
import InputError from "@/components/InputError";
import TextArea from "@/components/TextArea";
import PrimaryButton from "@/components/PrimaryButton";
import FileUpload from "@/components/FileUpload";
// components\SearcheableSelectInput.jsx
import SearcheableSelectInput from "@/components/SearcheableSelectInput";
import MyRichTextEditor from "@/components/MyRichTextEditor";
import { usePage } from "@inertiajs/react";
import { useEffect } from "react";
export default function SavingsPlanForm({ auth, savingsplan = null, update = false }) {
    const { data, setData, post, processing, errors, reset } = useForm({
      name: savingsplan?.name || "",
      short_description: savingsplan?.short_description || "",
      long_description: savingsplan?.long_description || "",
      daily_amount: savingsplan?.daily_amount || "",
      duration: savingsplan?.duration || "",
      target_amount: savingsplan?.target_amount || "",
      type: savingsplan?.type || "normal",
      monthly_charge: savingsplan?.monthly_charge || "",
      thumbnail: savingsplan?.thumbnail || null,
      photos: savingsplan?.photos || [],
    });
  
    const submit = (e) => {
      e.preventDefault();
      const routeName = update
        ? route("savings-plans.update", savingsplan.slug)
        : route("savings-plans.store");
  
      post(routeName, {
        preserveScroll: true,
        onSuccess: () => reset("thumbnail", "photos"),
      });
    };
  
    return (
      <form onSubmit={submit} className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Name */}
        <div>
          <InputLabel htmlFor="name" value="Name" />
          <TextInput className="w-full block px-5 py-3"  id="name" value={data.name} onChange={(e) => setData("name", e.target.value)} required />
          <InputError message={errors.name} />
        </div>
  
        {/* Daily Amount */}
        <div>
          <InputLabel htmlFor="daily_amount" value="Daily Amount" />
          <TextInput className="w-full block px-5 py-3" id="daily_amount" type="number" value={data.daily_amount} onChange={(e) => setData("daily_amount", e.target.value)} required />
          <InputError message={errors.daily_amount} />
        </div>
  
        {/* Duration */}
        <div>
          <InputLabel htmlFor="duration" value="Duration (days)" />
          <TextInput className="w-full block px-5 py-3" id="duration" type="number" value={data.duration} onChange={(e) => setData("duration", e.target.value)} required />
          <InputError message={errors.duration} />
        </div>
  
        {/* Target Amount */}
        <div>
          <InputLabel htmlFor="target_amount" value="Target Amount (optional)" />
          <TextInput className="w-full block px-5 py-3" id="target_amount" type="number" value={data.target_amount} onChange={(e) => setData("target_amount", e.target.value)} />
          <InputError message={errors.target_amount} />
        </div>
  
        {/* Type */}
        <div>
          <InputLabel htmlFor="type" value="Plan Type" />
          <SearcheableSelectInput
            options={[
              { id: "normal", name: "Normal" },
              { id: "investment", name: "Investment" },
            ]}
            defaultValue={data.type}
            onChange={(val) => setData("type", val[0])}
          />
          <InputError message={errors.type} />
        </div>
  
        {/* Monthly Charge */}
        <div>
          <InputLabel htmlFor="monthly_charge" value="Monthly Charge" />
          <TextInput className="w-full block px-5 py-3" id="monthly_charge" type="number" value={data.monthly_charge} onChange={(e) => setData("monthly_charge", e.target.value)} required />
          <InputError message={errors.monthly_charge} />
        </div>
  
        {/* Short Description */}
        <div>
          <InputLabel htmlFor="short_description" value="Short Description" />
          <TextArea className="w-full block px-5 py-3" id="short_description" value={data.short_description} onChange={(e) => setData("short_description", e.target.value)} />
          <InputError message={errors.short_description} />
        </div>
  
        {/* Long Description */}
        <div>
          <InputLabel htmlFor="long_description" value="Long Description" />
          <MyRichTextEditor
            initialHtmlString={data.long_description}
            setValue={(val) => setData("long_description", val)}
          />
          <InputError message={errors.long_description} />
        </div>
  
        {/* Thumbnail */}
        <div>
          <InputLabel htmlFor="thumbnail" value="Thumbnail (Image)" />
          <FileUpload
            name="thumbnail"
            multiple={false}
            image={data.thumbnail}
            setData={setData}
            accept={[".jpg", ".jpeg", ".png"]}
            error={errors.thumbnail}
          />
        </div>
  
        {/* Photos */}
        <div>
          <InputLabel htmlFor="photos" value="Gallery Photos (optional)" />
          <FileUpload
            name="photos"
            multiple={true}
            image={data.photos}
            setData={setData}
            accept={[".jpg", ".jpeg", ".png"]}
            error={errors.photos}
          />
        </div>
  
        <div className="flex justify-end">
          <PrimaryButton disabled={processing}>
            {processing ? "Saving..." : update ? "Update Savings Plan" : "Create Savings Plan"}
          </PrimaryButton>
        </div>
      </form>
    );
  }
  