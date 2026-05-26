import DataTable from "@/components/DataTable";
import DropdownComponent from "@/components/DropdownComponent";
import { Head, Link, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import formatDate from "@/utils/formatDate";
import { FaEdit, FaTrash } from "react-icons/fa";
import { HiStopCircle } from "react-icons/hi2";
import { FaCheckCircle } from "react-icons/fa";
import SweetAlert from "@/components/SweetAlert";
import { Button } from "@headlessui/react";
import UserForm from "./UserForm";
import AssignRoleForm from "./AssignRoleForm";
import { useAbilities } from '@/hooks/useAbilities';

export default function EditorManagement({ users, roles }) {
    const { abilities, checkAbility } = useAbilities('Editor Manager');
  
    console.log('====================================');
    console.log(users);
    console.log('====================================');
    const { data, setData,processing, errors, delete: destroy, post, put } = useForm({
        showDeleteConfirm: false,
        showSuspendConfirm: false,
        id: null,
        name: '',
        email: '',
        username: '',
        phone: '',
        password: '',
        password_confirmation: '',
        country: '',
        gender: '',
        date_of_birth: '',
        city: '',
        zip_code: '',
        address: '',
        avatar: null,
        ref_id: '',
        actionType: null, // "suspend" or "unsuspend"
        showCreate: null, // "suspend" or "unsuspend"
        showEdit: null, // "suspend" or "unsuspend"
        showAssignRole: null, // "suspend" or "unsuspend"
        role_ids:[],
    });

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Editor Management', href: '/users/editors' },
    ];

    const columns = [
        { name: 'Full Name', selector: 'name', sortable: true },
        { name: 'Email Address', selector: 'email', sortable: true },
        { name: 'Role', selector: 'role', sortable: true },
        { name: 'Status', selector: 'status', sortable: true },
        { name: 'Created At', selector: 'created_at', sortable: true },
        { name: 'Actions', selector: 'actions' },
    ];

    const handleEditAction = (id, user) => {
        setData({...data, id,
            name:user.name,
            phone:user.phone,
            email:user.email,
            showEdit:true
        })
    }
    const handleRoleAction = (id, user) => {
        setData({...data, id, role_ids: user.roles.map(item => item.id) ,
            showAssignRole:true
        })
    }
    const handleCreate = (e) => {
        e.preventDefault()
        post(route('editors.store'), {
            onSuccess: () => {
                setData('showCreate',false)
            }
        });
    }
    const handleAssignRole = (e) => {
        e.preventDefault()
        post(route('editors.assignRole', data.id), {
            onSuccess: () => {
                setData('showAssignRole',false)
            }
        });
    }
    const handleEdit = (e) => {
        e.preventDefault()
        put(route('editors.update', data.id), {
            onSuccess: () => {
                setData('showEdit',false)
            }
        });
    }
    const tableData = users?.data.map((user) => ({
        name: user.name,
        email: user.email,
        role: user.roles.map((item, index) => `${index + 1}. ${item.name}   `) ?? 'N/A',
        status: user.suspended
            ? <span className="text-red-500 font-semibold">Suspended</span>
            : <span className="text-green-600 font-semibold">Active</span>,
        created_at: formatDate(user.created_at),
        actions: (
            <DropdownComponent buttonText="Actions" buttonClass="bg-indigo-500">
               {abilities.can_edit &&  <Button  onClick={() => handleEditAction(user.id, user)} className="flex items-center gap-2 text-blue-700 text-sm">
                    <FaEdit /> Edit
                </Button>}
                {abilities.can_assign &&  <Button  onClick={() => handleRoleAction(user.id, user)} className="flex items-center gap-2 text-blue-700 text-sm">
                    <FaCheckCircle /> AssignRole
                </Button>}
                {abilities.can_delete &&  <button
                    onClick={() => setData({ showDeleteConfirm: true, id: user.id })}
                    className="flex items-center gap-2 text-red-500 text-sm"
                >
                    <FaTrash /> Delete
                </button>}
                {abilities.can_approve &&  user.suspended ? (
                    <button
                        onClick={() => setData({ showSuspendConfirm: true, id: user.id, actionType: "unsuspend" })}
                        className="flex items-center gap-2 text-green-600 text-sm"
                    >
                        <FaCheckCircle /> Unsuspend
                    </button>
                ) : (
                    <button
                        onClick={() => setData({ showSuspendConfirm: true, id: user.id, actionType: "suspend" })}
                        className="flex items-center gap-2 text-orange-500 text-sm"
                    >
                        <HiStopCircle /> Suspend
                    </button>
                )}
            </DropdownComponent>
        ),
    }));

    const handleSuspendToggle = () => {
        const routeName = data.actionType === "suspend" ? "editors.suspend" : "editors.unsuspend";
        put(route(routeName, data.id), {
            onSuccess: () => setData(prev => ({ ...prev, showSuspendConfirm: false, id: null })),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editor Management" />
            <div className="p-6 space-y-6">
               {abilities.can_create &&  <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-slate-800 dark:text-white">Editor Users</h1>
                    <Button onClick={() => setData({...data, showCreate:true})} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 transition cursor-pointer ">
                        Create Editor
                    </Button>
                </div>
}
                <DataTable
                    data={tableData}
                    columns={columns}
                    paginationLinks={users.links}
                    onPageChange={(url) => Inertia.visit(url)}
                />

                {data.showDeleteConfirm && (
                    <SweetAlert
                        show={data.showDeleteConfirm}
                        confirm={true}
                        message="Are you sure you want to delete this editor user?"
                        action={() => destroy(route("editors.destroy", data.id), {
                            onSuccess: () => setData(prev => ({ ...prev, showDeleteConfirm: false, id: null })),
                        })}
                        cancel={() => setData(prev => ({ ...prev, showDeleteConfirm: false, id: null }))}
                    />
                )}

                {data.showSuspendConfirm && (
                    <SweetAlert
                        show={data.showSuspendConfirm}
                        confirm={true}
                        message={`Are you sure you want to ${data.actionType} this editor account?`}
                        action={handleSuspendToggle}
                        cancel={() => setData(prev => ({ ...prev, showSuspendConfirm: false, id: null }))}
                    />
                )}
                {data.showCreate && (
                    <UserForm
                        show={data.showCreate}
                        onClose={() => setData('showCreate', false)}
                        data={data}
                        setData={setData}
                        submit={handleCreate}
                        processing={processing}
                        errors={errors}
                    />
                )}
                {data.showEdit && (
                    <UserForm
                        show={data.showEdit}
                        onClose={() => setData('showEdit', false)}
                        data={data}
                        setData={setData}
                        submit={handleEdit}
                        processing={processing}
                        errors={errors}
                    />
                )}
                {data.showAssignRole && (
                    <AssignRoleForm
                        show={data.showAssignRole}
                        onClose={() => setData('showAssignRole', false)}
                        data={data}
                        roles={roles}
                        setData={setData}
                        submit={handleAssignRole}
                        processing={processing}
                        errors={errors}
                    />
                )}
            </div>
        </AppLayout>
    );
}
