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

export default function InvestmentPlanForm({ auth, investmentplan = null, categories, update=false }) {
 //const { categories } = usePage().props;

  const { data, setData, post, processing, errors,put, reset } = useForm({
    name: investmentplan?.name || "",
    category_id: investmentplan?.category_id || "",
    min_amount: investmentplan?.min_amount || "",
    max_amount: investmentplan?.max_amount || "",
    roi: investmentplan?.roi || "",
    duration: investmentplan?.duration || "",
    payout_frequency: investmentplan?.payout_frequency || "monthly",
    short_description: investmentplan?.short_description || "",
    long_description: investmentplan?.long_description || "",
    thumbnail: investmentplan?.thumbnail || null,
    photos: investmentplan?.photos || [],
  });

  const submit = (e) => {
    e.preventDefault();
    console.log('=======data=============================');
    console.log(data);
    console.log('============data========================');

    if (update) {
      post(route("investment-plans.update", investmentplan.slug), {
        preserveScroll: true,
        onSuccess: () => reset("thumbnail", "photos"),
      });
    }else {
      post(route("investment-plans.store"), {
        preserveScroll: true,
        onSuccess: () => reset("thumbnail", "photos"),
      });
    }

  };

  return (
    <>
      <Head title="Create Investment Plan" />

      <form onSubmit={submit} className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Name */}
        <div>
          <InputLabel htmlFor="name" value="Name" />
          <TextInput id="name" value={data.name} onChange={(e) => setData("name", e.target.value)} className="mt-1 block w-full px-5 py-3" required />
          <InputError message={errors.name} className="mt-2" />
        </div>

        {/* Category */}
        <div>
          <InputLabel htmlFor="category_id" value="Category" />
          <SearcheableSelectInput
            options={categories}
            defaultValue={data.category_id}
            onChange={(val) => setData("category_id", val[0])}
          />
          <InputError message={errors.category_id} className="mt-2" />
        </div>

        {/* Min Amount */}
        <div>
          <InputLabel htmlFor="min_amount" value="Minimum Amount" />
          <TextInput id="min_amount" type="number" value={data.min_amount} onChange={(e) => setData("min_amount", e.target.value)} className="mt-1 block w-full px-5 py-3" required />
          <InputError message={errors.min_amount} className="mt-2" />
        </div>

        {/* Max Amount */}
        <div>
          <InputLabel htmlFor="max_amount" value="Maximum Amount (Optional)" />
          <TextInput id="max_amount" type="number" value={data.max_amount} onChange={(e) => setData("max_amount", e.target.value)} className="mt-1 block w-full px-5 py-3" />
          <InputError message={errors.max_amount} className="mt-2" />
        </div>

        {/* ROI */}
        <div>
          <InputLabel htmlFor="roi" value="ROI (%)" />
          <TextInput id="roi" type="number" value={data.roi} onChange={(e) => setData("roi", e.target.value)} className="mt-1 block w-full px-5 py-3" required />
          <InputError message={errors.roi} className="mt-2" />
        </div>

       {/* Duration */}
{/* Duration */}
<div>
  <InputLabel htmlFor="duration" value="Duration (in hours)" />
  <p className="text-sm text-slate-500 mb-1 leading-relaxed">
    Please enter the duration in <strong>hours</strong>. Convert other time units as follows:<br />
    • 1 day = 24 hours<br />
    • 1 week = 168 hours<br />
    • 1 month ≈ 730 hours (average)<br />
    • 1 normal year = 8,760 hours<br />
    • 1 leap year = 8,784 hours
  </p>
  <TextInput
    id="duration"
    type="number"
    value={data.duration}
    onChange={(e) => setData("duration", e.target.value)}
    className="mt-1 block w-full px-5 py-3"
    required
  />
  <InputError message={errors.duration} className="mt-2" />
</div>


        {/* Payout Frequency */}
        <div>
          <InputLabel htmlFor="payout_frequency" value="Payout Frequency" />
          <SearcheableSelectInput
            options={[
              { id: "daily", name: "Daily" },
              { id: "weekly", name: "Weekly" },
              { id: "monthly", name: "Monthly" },
              { id: "yearly", name: "Yearly" },
            ]}
            defaultValue={data.payout_frequency}
            onChange={(val) => setData("payout_frequency", val[0])}
          />
          <InputError message={errors.payout_frequency} className="mt-2" />
        </div>

        {/* Short Description */}
        <div>
          <InputLabel htmlFor="short_description" value="Short Description" />
          <TextArea id="short_description" value={data.short_description} onChange={(e) => setData("short_description", e.target.value)} className="mt-1 block w-full px-5 py-3" />
          <InputError message={errors.short_description} className="mt-2" />
        </div>

        {/* Long Description */}
        <div>
          <InputLabel htmlFor="long_description" value="Long Description" />
          <MyRichTextEditor
            initialHtmlString={data.long_description}
            setValue={(value) => setData("long_description", value)}
          />
          <InputError message={errors.long_description} className="mt-2" />
        </div>

        {/* Thumbnail */}
        <div>
          <InputLabel htmlFor="thumbnail" value="Thumbnail" />
          <FileUpload
            label="Upload Thumbnail"
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
          <InputLabel htmlFor="photos" value="Gallery Photos" />
          <FileUpload
            label="Upload Photos"
            name="photos"
            multiple={true}
            image={data.photos}
            setData={setData}
            accept={[".jpg", ".jpeg", ".png"]}
            error={errors.photos}
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <PrimaryButton disabled={processing}>
            {processing ? "Saving..." : investmentplan ? "Update Investment Plan" : "Create Investment Plan"}
          </PrimaryButton>
        </div>
      </form>
    </>

  );
}
