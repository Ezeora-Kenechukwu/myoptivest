import InputError from "@/components/InputError";
import InputLabel from "@/components/InputLabel";
import TextArea from "@/components/TextArea";
import TextInput from "@/components/TextInput";
import { useForm } from "@inertiajs/react";
import SearchableSelectInput from "@/components/SearcheableSelectInput";
import MyRichTextEditor from "@/components/MyRichTextEditor";
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FileUpload from "@/components/FileUpload";

export default function ReservationForm({ celebrities, reservation = null }) {
    console.log('==========reservation==========================');
    console.log(reservation);
    console.log('======================reservation==============');
    const { data, setData, post, put, processing, errors } = useForm({
        celebrity_id: reservation?.celebrity_id || "",
        occasion_type: reservation?.occasion_type || "",
        event_date: reservation?.event_date || "",
        event_time: reservation?.event_time || "",
        event_duration: reservation?.event_duration || "",
        event_location: reservation?.event_location || "",
        event_state: reservation?.event_state || "",
        event_city: reservation?.event_city || "",
        nearest_landmark: reservation?.nearest_landmark || "",
        direction_hint: reservation?.direction_hint || "",
        nearest_police_station: reservation?.nearest_police_station || "",
        additional_info: reservation?.additional_info || "",
        amount: reservation?.amount || "",
        id: reservation?.id || null, // to help identify update mode
    });


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('===========data=========================');
        console.log(data);
        console.log('====================================');
        if (reservation) {

            post(route("reservations.update", reservation.slug));

        } else {
            post(route("reservations.store"));
        }
    };
    const addLink = () => {
        setData("social_links", [
          ...data.social_links,
          { title: "", link: "" },
        ]);
      };

      const removeLink = (index) => {
        if (data.social_links.length > 1) {
          const updatedLinks = data.social_links.filter((_, i) => i !== index);
          setData("social_links", updatedLinks);
        }
      };

      const handleChange = (index, field, value) => {
        const updatedLinks = [...data.social_links];
        updatedLinks[index][field] = value;
        setData("social_links", updatedLinks);
      };
    return (
        <div className="p-6 shadow-slate-500 shadow-lg text-slate-800 dark:text-slate-100 rounded-xl w-full max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">{reservation ? "Edit Reservation" : "Create Reservation"}</h2>
            <form
    onSubmit={(e) => {
        e.preventDefault();
        data.id
            ? put(route("reservations.update", data.id))
            : post(route("reservations.store"));
    }}
    className="max-w-3xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow"
>
    {/* Celebrity */}
    <div>
        <InputLabel htmlFor="celebrity_id">Select Celebrity</InputLabel>
        <SearchableSelectInput
    options={celebrities}
    multiple={false}
    onChange={(value) => {
        const selectedId = value[0];
        const selectedCelebrity = celebrities.find((c) => c.id === selectedId);

        setData((prevData) => ({
            ...prevData,
            celebrity_id: selectedId,
            amount: selectedCelebrity?.booking_amount || 0,
        }));
    }}
    className="w-full p-4 rounded dark:bg-gray-700 dark:text-white mb-4"
/>

        <InputError message={errors.celebrity_id} />
    </div>

    {/* Occasion Type */}
    <div>
        <InputLabel htmlFor="occasion_type">Occasion Type</InputLabel>
        <TextInput
            type="text"
            value={data.occasion_type}
            onChange={(e) => setData("occasion_type", e.target.value)}
            className="w-full p-4 rounded dark:bg-gray-700 dark:text-white mb-4"
        />
        <InputError message={errors.occasion_type} />
    </div>

    {/* Event Date */}
    <div>
        <InputLabel htmlFor="event_date">Event Date</InputLabel>
        <TextInput
            type="date"
            value={data.event_date}
            onChange={(e) => setData("event_date", e.target.value)}
            className="w-full p-4 rounded dark:bg-gray-700 dark:text-white mb-4"
        />
        <InputError message={errors.event_date} />
    </div>

    {/* Event Time */}
    <div>
        <InputLabel htmlFor="event_time">Event Time</InputLabel>
        <TextInput
            type="time"
            value={data.event_time}
            onChange={(e) => setData("event_time", e.target.value)}
            className="w-full p-4 rounded dark:bg-gray-700 dark:text-white mb-4"
        />
        <InputError message={errors.event_time} />
    </div>

    {/* Event Duration */}
    <div>
        <InputLabel htmlFor="event_duration">Event Duration</InputLabel>
        <TextInput
            type="text"
            value={data.event_duration}
            onChange={(e) => setData("event_duration", e.target.value)}
            className="w-full p-4 rounded dark:bg-gray-700 dark:text-white mb-4"
        />
        <InputError message={errors.event_duration} />
    </div>

    {/* Event Location */}
    <div>
        <InputLabel htmlFor="event_location">Event Location</InputLabel>
        <TextInput
            type="text"
            value={data.event_location}
            onChange={(e) => setData("event_location", e.target.value)}
            className="w-full p-4 rounded dark:bg-gray-700 dark:text-white mb-4"
        />
        <InputError message={errors.event_location} />
    </div>

    {/* Event State */}
    <div>
        <InputLabel htmlFor="event_state">Event State</InputLabel>
        <TextInput
            type="text"
            value={data.event_state}
            onChange={(e) => setData("event_state", e.target.value)}
            className="w-full p-4 rounded dark:bg-gray-700 dark:text-white mb-4"
        />
        <InputError message={errors.event_state} />
    </div>

    {/* Event City */}
    <div>
        <InputLabel htmlFor="event_city">Event City</InputLabel>
        <TextInput
            type="text"
            value={data.event_city}
            onChange={(e) => setData("event_city", e.target.value)}
            className="w-full p-4 rounded dark:bg-gray-700 dark:text-white mb-4"
        />
        <InputError message={errors.event_city} />
    </div>

    {/* Nearest Landmark */}
    <div>
        <InputLabel htmlFor="nearest_landmark">Nearest Landmark</InputLabel>
        <TextInput
            type="text"
            value={data.nearest_landmark}
            onChange={(e) => setData("nearest_landmark", e.target.value)}
            className="w-full p-4 rounded dark:bg-gray-700 dark:text-white mb-4"
        />
        <InputError message={errors.nearest_landmark} />
    </div>

    {/* Direction Hint */}
    <div>
        <InputLabel htmlFor="direction_hint">Direction Hint</InputLabel>
        <TextArea
            value={data.direction_hint}
            onChange={(e) => setData("direction_hint", e.target.value)}
            className="w-full p-4 rounded dark:bg-gray-700 dark:text-white mb-4"
        />
        <InputError message={errors.direction_hint} />
    </div>

    {/* Nearest Police Station */}
    <div>
        <InputLabel htmlFor="nearest_police_station">Nearest Police Station</InputLabel>
        <TextInput
            type="text"
            value={data.nearest_police_station}
            onChange={(e) => setData("nearest_police_station", e.target.value)}
            className="w-full p-4 rounded dark:bg-gray-700 dark:text-white mb-4"
        />
        <InputError message={errors.nearest_police_station} />
    </div>

    {/* Additional Info */}
    <div>
        <InputLabel htmlFor="additional_info">Additional Info</InputLabel>
        <MyRichTextEditor
            initialHtmlString={data.additional_info}
            setValue={(value) => setData("additional_info", value)}
            className="w-full p-4 rounded dark:bg-gray-700 dark:text-white mb-4"
        />
        <InputError message={errors.additional_info} />
    </div>

    {/* Amount */}
    <div>
        <InputLabel htmlFor="amount">Amount</InputLabel>
        <TextInput
    type="number"
    value={data.amount}
    disabled
    className="w-full p-4 rounded dark:bg-gray-700 dark:text-white mb-4 bg-gray-200  cursor-not-allowed"
/>

        <InputError message={errors.amount} />
    </div>

    {/* Submit Button */}
    <div className="pt-4">
        <Button type="submit" disabled={processing}>
            {processing
                ? data.id
                    ? "Updating..."
                    : "Submitting..."
                : data.id
                ? "Update Reservation"
                : "Submit Reservation"}
        </Button>
    </div>
</form>

        </div>
    );
}
