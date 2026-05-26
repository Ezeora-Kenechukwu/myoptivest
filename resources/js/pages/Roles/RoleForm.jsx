import InputError from "@/components/InputError";
import InputLabel from "@/components/InputLabel";
import TextArea from "@/components/TextArea";
import TextInput from "@/components/TextInput";
import Checkbox from "@/components/Checkbox";
import SearchableSelectInput from "@/components/SearcheableSelectInput";

import { useForm } from "@inertiajs/react";
import { useState } from "react";

export default function RoleForm({ role = null, permissions, roles }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: role?.name || "",
        description: role?.description || "",
        // base_role: role?.base_role || false,
        parent_role_id: role?.parent_role_id || "",
        type: role?.type || "user",
        permissions: role?.permissions?.map((p) => p.id) || [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (role) {
            put(route("roles.update", role.slug));
        } else {
            post(route("roles.store"));
        }
    };

    return (
        <div className="p-6 shadow-slate-500 shadow-lg text-slate-800 dark:text-slate-100 rounded-xl w-full max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">{role ? "Edit Role" : "Create Role"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4 px-5">
                <div>
                    <InputLabel className="block text-slate-400" htmlFor="name">Name</InputLabel>
                    <TextInput
                        type="text"
                        className="py-2 px-4 block w-full "
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
                <div>
                    <InputLabel className="block text-slate-400" htmlFor="parent_role_id">Parent Role</InputLabel>
                    <SearchableSelectInput options={roles} multiple={false} defaultValue={data?.parent_role_id ? [data?.parent_role_id] : []} onChange={(value) => setData('parent_role_id', value[0])} />

                    <InputError message={errors.parent_role_id}/>

                </div>
                <div>
                    <InputLabel className="block text-slate-400" htmlFor="parent_role_id">Role Type</InputLabel>
                    <SearchableSelectInput options={[
                        {id:'admin', name:"Admin"},
                        {id:'editor', name:"editor"},
                        {id:'user', name:"User"},

                    ]} multiple={false} defaultValue={data?.type ? [data?.type] : []} onChange={(value) => setData('type', value[0])} />

                    <InputError message={errors.type}/>

                </div>

                <div>
                    <InputLabel className="block text-slate-400 ">Description</InputLabel>
                    <TextArea
                        className="w-full py-2 px-4"
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                    />
                    <InputError message={errors.description}/>

                </div>
                {/* <div>
    <label className="flex items-center gap-2 text-slate-400">
        <Checkbox
            checked={data.base_role}
            onChange={(e) => setData("base_role", e.target.checked)}
        />
        Is Base Role
    </label>
    <InputError message={errors.base_role} />
</div> */}
                 {/* <div>                   <label className="block text-slate-400">Permissions</label>
                    <div className="grid grid-cols-2 gap-2">
                        {permissions.map((permission) => (
                            <label key={permission.id} className="flex items-center gap-2">
                                <Checkbox
                                    type="checkbox"
                                    className=""
                                    checked={data.permissions.includes(permission.id)}
                                    onChange={(e) => {
                                        const newPermissions = e.target.checked
                                            ? [...data.permissions, permission.id]
                                            : data.permissions.filter((id) => id !== permission.id);
                                        setData("permissions", newPermissions);
                                    }}
                                />
                                {permission.name}
                            </label>
                        ))}
                    </div>
                 </div> */}

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
