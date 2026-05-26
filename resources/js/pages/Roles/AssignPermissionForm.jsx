import { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import Modal from "@/components/Modal";
import Checkbox from "@/components/Checkbox";
import { FaTimes, FaSearch } from "react-icons/fa";

export default function AssignPermissionForm({ show, onClose, role, permissions }) {
    const { data, setData, post, processing, reset } = useForm({
        role_id: role?.id || "",
        permissions: role?.permissions?.map(p => ({
            permission_id: p.id,
            ...p.pivot // Extract existing abilities
        })) || []
    });

    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (role) {
            setData({
                role_id: role.id,
                permissions: role.permissions.map(p => ({
                    permission_id: p.id,
                    ...p.pivot // Load assigned abilities
                }))
            });
        }
    }, [role]);

    const abilitiesList = [
        "can_create", "can_edit", "can_view", "can_delete", "can_forceDelete",
        "can_index", "can_store", "can_approve", "can_restore", "can_indexTrash",
        "can_viewTrash", "can_assign", "can_update", "can_join", "can_pin",
        "can_share", "can_copy", "can_download", "can_preview", "can_upload",'can_pay',
                'can_withdraw',
                'can_rank',
                'can_show',
                'can_block',
                'can_unblock',
                'can_activate',
                'can_deactivate',
                'can_suspend',
                'can_unsuspend',
                'can_confirm',
                'can_reply',
                'can_send',
                'can_notify',
                'can_read',
                'can_readall',
    ];

    // Toggle permission
    const togglePermission = (permissionId) => {
        setData(prevData => {
            const exists = prevData.permissions.find(p => p.permission_id === permissionId);
            return exists
                ? { ...prevData, permissions: prevData.permissions.filter(p => p.permission_id !== permissionId) }
                : { ...prevData, permissions: [...prevData.permissions, { permission_id: permissionId }] };
        });
    };

    // Toggle individual ability
    const toggleAbility = (permissionId, ability) => {
        setData(prevData => ({
            ...prevData,
            permissions: prevData.permissions.map(p =>
                p.permission_id === permissionId ? { ...p, [ability]: !p[ability] } : p
            )
        }));
    };

    // Toggle "Select All" abilities for a permission
    const toggleSelectAll = (permissionId) => {
        setData(prevData => {
            const exists = prevData.permissions.find(p => p.permission_id === permissionId);
            const allSelected = exists && abilitiesList.every(ability => exists[ability]); // Check if all are selected

            return {
                ...prevData,
                permissions: prevData.permissions.map(p =>
                    p.permission_id === permissionId
                        ? allSelected
                            ? { permission_id: permissionId } // Clear all
                            : { permission_id: permissionId, ...Object.fromEntries(abilitiesList.map(a => [a, true])) } // Select all
                        : p
                )
            };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("roles.assignPermissions", role.slug), {
            onSuccess: () => {
                reset();
                onClose();
            }
        });
    };

    // Filter permissions based on search query
    const filteredPermissions = permissions.filter(permission =>
        permission.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Modal show={show} closeable onClose={onClose}>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Assign Permissions to {role?.name}</h2>
                    <button onClick={onClose} className="text-red-500"><FaTimes /></button>
                </div>

                {/* Search Input */}
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Search permissions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
                    />
                    <FaSearch className="absolute top-3 right-3 text-gray-400" />
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {filteredPermissions.map(permission => {
                            const permissionData = data.permissions.find(p => p.permission_id === permission.id);
                            const isChecked = !!permissionData;
                            const allSelected = isChecked && abilitiesList.every(ability => permissionData?.[ability]);

                            return (
                                <div key={permission.id} className="border rounded-md p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                checked={isChecked}
                                                onChange={() => togglePermission(permission.id)}
                                            />
                                            <span className="font-semibold">{permission.name}</span>
                                        </div>

                                        {isChecked && (
                                            <button
                                                type="button"
                                                onClick={() => toggleSelectAll(permission.id)}
                                                className={`text-sm px-2 py-1 rounded-md ${allSelected ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
                                            >
                                                {allSelected ? "Deselect All" : "Select All"}
                                            </button>
                                        )}
                                    </div>

                                    {isChecked && (
                                        <div className="grid grid-cols-3 gap-2 mt-2">
                                            {abilitiesList.map(ability => (
                                                <label key={ability} className="flex items-center gap-2">
                                                    <Checkbox
                                                        checked={permissionData?.[ability] || false}
                                                        onChange={() => toggleAbility(permission.id, ability)}
                                                    />
                                                    {ability.replace("can_", "").replace(/([A-Z])/g, ' $1').trim()}
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md" disabled={processing}>
                            {processing ? "Assigning..." : "Assign Permissions"}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
