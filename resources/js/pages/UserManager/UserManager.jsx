import DataTable from "@/components/DataTable";
import DropdownComponent from "@/components/DropdownComponent";
import { Head, Link, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import formatDate from "@/utils/formatDate";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { HiStopCircle } from "react-icons/hi2";
import { FaCheckCircle } from "react-icons/fa";
import SweetAlert from "@/components/SweetAlert";
import { Button } from "@headlessui/react";
import UserForm from "./UserForm";
import AssignRoleForm from "./AssignRoleForm";
import { HiChevronRight } from "react-icons/hi";
import InputError from "@/components/InputError";
import InputLabel from "@/components/InputLabel";
import TextArea from "@/components/TextArea";
import TextInput from "@/components/TextInput";
import SearchableSelectInput from "@/components/SearcheableSelectInput";
import { useAbilities } from '@/hooks/useAbilities';
import ViewUser from "./ViewUser";

export default function UserManagement({ users, roles }) {
    const { abilities, checkAbility } = useAbilities('User Management');

    console.log('================users====================');
    console.log(users);
    console.log('=================users===================');
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
        showView: null, // "suspend" or "unsuspend"
        showAssignRole: null, // "suspend" or "unsuspend"
        showRequestShow: null, // "suspend" or "unsuspend"
        showValidationShow: null, // "suspend" or "unsuspend"
        should_activate_membership: null, // "suspend" or "unsuspend"
        membership_activation_amount: null, // "suspend" or "unsuspend"
        role_ids:[],
        user:null,
    });

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'User Management', href: '/users/users' },
    ];

    const columns = [
        { name: 'Full Name', selector: 'name', sortable: true },
        { name: 'Email Address', selector: 'email', sortable: true },
        { name: 'Role', selector: 'role', sortable: true },
        { name: 'Status', selector: 'status', sortable: true },
        { name: 'Withdrawable Balance', selector: 'wallet', sortable: true },
        { name: 'Referal Code', selector: 'refferal_code', sortable: true },
        { name: 'Referal Link', selector: 'referal_link', sortable: true },
        { name: 'Refered By', selector: 'referrer', sortable: true },
       
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
    const handleViewAction = (id, user) => {
        setData({...data, id,
           user,
          
            showView:true
        })
    }
    const MembershipRequest = (id, user) => {
        setData({...data, id,
            name:user.name,
            phone:user.phone,
            email:user.email,
            showRequestShow:true
        })
    }
    const MembershipValidation = (id, user) => {
        setData({...data, id,
            name:user.name,
            phone:user.phone,
            email:user.email,

            showValidationShow:true
        })
    }
    const handleRoleAction = (id, user) => {
        setData({...data, id, role_ids: user.roles.map(item => item.id) ,
            showAssignRole:true
        })
    }
    const handleCreate = (e) => {
        e.preventDefault()
        post(route('users.store'), {
            onSuccess: () => {
                setData('showCreate',false)
            }
        });
    }
    const handleAssignRole = (e) => {
        e.preventDefault()
        post(route('users.assignRole', data.id), {
            onSuccess: () => {
                setData('showAssignRole',false)
            }
        });
    }
    const handleEdit = (e) => {
        e.preventDefault()
        put(route('users.update', data.id), {
            onSuccess: () => {
                setData('showEdit',false)
            }
        });
    }

    const tableData = users?.data.map((user) => ({
        name: user.name,
        email: user.email,
        wallet: parseFloat(user.wallet).toLocaleString(),
        refferal_code: user.refferal_code,
        referal_link: <Link href={user.referral_link} className="text-blue-500 underline" target="_blank">{user.referral_link}</Link>,
        referrer: user.referrer ? user.referrer.name : "N/A",
        role: user.roles.map((item, index) => `${index + 1}. ${item.name}   `) ?? 'N/A',
        status: user.suspended
            ? <span className="text-red-500 font-semibold">Suspended</span>
            : <span className="text-green-600 font-semibold">Active</span>,
            membership_activated_on: user.membership_activated_on ? formatDate(user.membership_activated_on) : '',
        created_at: formatDate(user.created_at),
        updated_at: formatDate(user.updated_at),
        actions: (
            <DropdownComponent buttonText="Actions" buttonClass="bg-indigo-500">
                { abilities?.can_view &&  <Button  onClick={() => handleViewAction(user.id, user)} className="flex items-center gap-2 text-blue-700 text-sm">
                    <FaEye /> View
                </Button>}
                { abilities?.can_edit &&  <Button  onClick={() => handleEditAction(user.id, user)} className="flex items-center gap-2 text-blue-700 text-sm">
                    <FaEdit /> Edit
                </Button>}
                  { abilities?.can_approve &&  user.membership_status !== "validated" && user.membership_status !== "accepted" &&  (
                                    <Button onClick={() => MembershipRequest(user.id, user)} className="flex gap-2 items-center text-sm text-green-700">
                                        <HiChevronRight /> Request Membership
                                    </Button>
                                )}
                  { abilities?.can_approve &&  user.membership_status !== "validated" && user.membership_status == "accepted" &&  (
                                    <Button onClick={() => MembershipValidation(user.id, user)} className="flex gap-2 items-center text-sm text-green-700">
                                        <HiChevronRight /> Validate Membership
                                    </Button>
                                )}
                { abilities?.can_assign &&  <Button  onClick={() => handleRoleAction(user.id, user)} className="flex items-center gap-2 text-blue-700 text-sm">
                    <FaCheckCircle /> AssignRole
                </Button>}
                { abilities?.can_delete &&  <button
                    onClick={() => setData({ showDeleteConfirm: true, id: user.id })}
                    className="flex items-center gap-2 text-red-500 text-sm"
                >
                    <FaTrash /> Delete
                </button>}
                { abilities?.can_approve &&  user.suspended ? (
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
        const routeName = data.actionType === "suspend" ? "users.suspend" : "users.unsuspend";
        put(route(routeName, data.id), {
            onSuccess: () => setData(prev => ({ ...prev, showSuspendConfirm: false, id: null })),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />
            <div className="p-6 space-y-6">
                { abilities?.can_create &&  <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-slate-800 dark:text-white">User Users</h1>
                    <Button onClick={() => setData({...data, showCreate:true})} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 transition cursor-pointer ">
                        Create User
                    </Button>
                </div>}

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
                        message="Are you sure you want to delete this user user?"
                        action={() => destroy(route("users.destroy", data.id), {
                            onSuccess: () => setData(prev => ({ ...prev, showDeleteConfirm: false, id: null })),
                        })}
                        cancel={() => setData(prev => ({ ...prev, showDeleteConfirm: false, id: null }))}
                    />
                )}

                {data.showSuspendConfirm && (
                    <SweetAlert
                        show={data.showSuspendConfirm}
                        confirm={true}
                        message={`Are you sure you want to ${data.actionType} this user account?`}
                        action={handleSuspendToggle}
                        cancel={() => setData(prev => ({ ...prev, showSuspendConfirm: false, id: null }))}
                    />
                )}
                {data.showValidationShow && (
                    <SweetAlert
                        show={data.showValidationShow}
                        confirm={true}
                        message={`Are you sure you want to Activate this user's membership Card?`}
                        action={() => post(route("users.activateMembership", data.id), {
                            onSuccess: () => setData(prev => ({ ...prev, showValidationShow: false, id: null })),
                        })}
                        cancel={() => setData(prev => ({ ...prev, showValidationShow: false, id: null }))}
                    />
                )}
                {data.showView && (
                    <ViewUser
                        show={data.showView}
                        onClose={() => setData('showView', false)}
                        data={data}
                        setData={setData}
                        submit={handleCreate}
                        processing={processing}
                        errors={errors}
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
                {data.showRequestShow && (
                    <SweetAlert
                        show={data.showRequestShow}
                        confirm={true}
                        message={`You're about to Request a User to be a member, please Select the membership type and the amount. Proceed?`}
                        action={() =>
                            post(route("users.requestMembershipValidation", data.id), {
                                onSuccess: () => {

                                    setData(prev => ({ ...prev, showRequestShow: false, actionItem: null }));
                                },
                            })
                        }
                        cancel={() => setData(prev => ({ ...prev, showRequestShow: false, actionItem: null }))}
                    >
                     <div>
                    <InputLabel className="block text-slate-400" htmlFor="membership_type">Select Celebrity Category</InputLabel>
                    <SearchableSelectInput options={[
                        {id:'bronze', name:'bronze'},
                        {id:'silver', name:'silver'},
                        {id:'gold', name:'gold'},
                        {id:'platinum', name:'platinum'},
                        {id:'diamond', name:'diamond'},

                    ]} multiple={false} defaultValue={data?.membership_type} onChange={(value) => setData('membership_type', value[0])} />

                    <InputError message={errors.membership_type}/>

                </div>
                            <div className="my-4">
                                <InputLabel htmlFor="membership_activation_amount">Amount</InputLabel>
                                <TextInput
                                    type="url"
                                    value={data.membership_activation_amount}
                                    onChange={(e) => setData("membership_activation_amount", e.target.value)}
                                    className="w-full py-2 px-4 rounded dark:bg-gray-700 dark:text-white mb-2"
                                />
                                <InputError message={errors.membership_activation_amount} />
                            </div>
                    </SweetAlert>
                )}
            </div>
        </AppLayout>
    );
}
