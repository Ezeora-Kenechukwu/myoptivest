import InputError from "@/components/InputError";
import InputLabel from "@/components/InputLabel";
import TextArea from "@/components/TextArea";
import TextInput from "@/components/TextInput";
import { useForm } from "@inertiajs/react";

export default function PermissionForm({ permission = null }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: permission?.name || "",
        description: permission?.description || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (permission) {
            put(route("permissions.update", permission.slug));
        } else {
            post(route("permissions.store"));
        }
    };

    return (
        <div className="p-6 shadow-slate-500 shadow-lg text-slate-800 dark:text-slate-100 rounded-xl w-full max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">{permission ? "Edit Permission" : "Create Permission"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4 px-5">
                <div>
                                    <InputLabel className="block text-slate-400" htmlFor="name">Name</InputLabel>
                                    <TextInput
                                        type="text"
                                        className=" block w-full py-2 "
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                    />
                                    <InputError message={errors.name}/>
                                </div>

                <div>
                                    <InputLabel className="block text-slate-400">Description</InputLabel>
                                    <TextArea
                                        className="w-full"
                                        value={data.description}
                                        onChange={(e) => setData("description", e.target.value)}
                                    />
                                    <InputError message={errors.description}/>

                                </div>

                <button
                    type="submit"
                    className="w-full bg-slate-500 hover:bg-slate-400 transition p-2 rounded-md text-white"
                    disabled={processing}
                >
                    {processing ? "Saving..." : "Save"}
                </button>
            </form>
        </div>
    );
}
