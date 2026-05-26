import DataTable from "@/components/DataTable";
import DropdownComponent from "@/components/DropdownComponent";

import formatDate from "@/utils/formatDate";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { HiChevronRight } from "react-icons/hi";
import { HiStopCircle } from "react-icons/hi2";
import AppLayout from "../../layouts/app-layout";
import SweetAlert from "@/components/SweetAlert";
import { useAbilities } from '@/hooks/useAbilities';
import { Button } from "@headlessui/react";

import Badge from "@/components/Badge";

export default function ManualPaymentMethodIndex({methods}) {

    const { abilities, checkAbility } = useAbilities('ManualPaymentMethod');
    // console.log("can_edit/can_delete", can_delete, can_edit);
const {data, setData, post, delete:destroy} = useForm({
    showAssignManualPaymentMethod: false,
    showDeleteConfirm: false,
    showActivateConfirm: false,
    showDeactivateConfirm: false,
    role:null,
id:'',

})

const columns = [
    { name: 'Name', selector: 'name', sortable: true, filterable: true, dataType: 'string' },
    { name: 'Type', selector: 'type', sortable: true, filterable: true, dataType: 'string' },
    { name: 'Instructions', selector: 'instructions', sortable: false, filterable: true, dataType: 'string', width:300 },
    { name: 'Account Name', selector: 'account_name', sortable: false, filterable: true, dataType: 'string' },
    { name: 'Account Number', selector: 'account_number', sortable: false, filterable: true, dataType: 'string' },
    { name: 'Bank Name', selector: 'bank_name', sortable: false, filterable: true, dataType: 'string' },
    { name: 'Wallet Address', selector: 'wallet_address', sortable: false, filterable: true, dataType: 'string' },
    { name: 'Method Icons ', selector: 'icon', sortable: false, filterable: false, dataType: 'image' },
    { name: 'Active', selector: 'active' },
    { name: 'Created On', selector: 'created_at', sortable: true, filterable: true, dataType: 'string' },
    { name: 'Last Updated', selector: 'updated_at', sortable: true, filterable: true, dataType: 'string' },
    { name: 'Actions', selector: 'actions', sortable: false, filterable: false, dataType: 'string' },
];
const handleActivate = (item) => {
    setData(prev => ({ ...prev, showActivateConfirm: true, id:item.id, actionItem: item }));
};

const handleDeactivate = (item) => {
    setData(prev => ({ ...prev, showDeactivateConfirm: true,id:item.id, actionItem: item }));
};

const manualpaymentmethodData = methods
? methods.map((item) => {
    const {
        id,
        name,
        type,
        instructions,
        account_name,
        account_number,
        bank_name,
        wallet_address,
        icon,
        active,
        created_at,
        updated_at,
    } = item;

    return {
        name,
        type,
        instructions,
        account_name,
        account_number,
        bank_name,
        wallet_address,
         active: <Badge status={active ? "active" : "inactive"} />,
        icon: icon ? (
           <div className="w-15">
             <img src={`/storage/${icon}`} alt="icon" className="w-15 h-15 rounded-full object-cover" />
           </div>
        ) : (
            'N/A'
        ),
        created_at: formatDate(created_at),
        updated_at: formatDate(updated_at),
        actions: (
            <DropdownComponent buttonText="Actions" buttonClass="bg-red-500">
                {abilities.can_edit && (
                    <Link href={route("manual-payment-methods.edit", id)} className="flex gap-4 items-center text-sm">
                        <FaEdit /> Edit
                    </Link>
                )}

                {abilities.can_delete && (
                    <button
                        className="flex gap-4 items-center text-sm text-red-500"
                        onClick={() =>
                            setData((prev) => ({ ...prev, showDeleteConfirm: true, id }))
                        }
                    >
                        <FaTrash />
                        Delete
                    </button>
                )}

                 {abilities.can_update && !active && (
                                    <Button onClick={() => handleActivate(item)} className="flex gap-2 items-center text-green-700 text-sm">
                                        <HiChevronRight /> Activate
                                    </Button>
                                )}
                                {abilities.can_update && active && (
                                    <Button onClick={() => handleDeactivate(item)} className="flex gap-2 items-center text-red-500 text-sm">
                                        <HiStopCircle /> Deactivate
                                    </Button>
                                )}
            </DropdownComponent>
        ),
    };
})
: [];


        const breadcrumbs = [
            {
                title: 'Dashboard',
                href: '/dashboard',
            },
            {
                title: 'ManualPaymentMethod Settings',
                href: '/schools',
            },



        ];

    return (

     <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="ManualPaymentMethod Settings" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <section className="w-full h-full rounded-lg shadow shadow-slate-950 dark:shadow-slate-500 p-4">
           <div className="p-6  rounded-xl">
            {abilities.can_create && <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">ManualPaymentMethods</h1>
                <Link href={route("manual-payment-methods.create")} className="bg-slate-500 text-white px-4 py-2 rounded-md hover:bg-slate-400 transition">
                    Create ManualPaymentMethod
                </Link>
            </div>}

            <DataTable
                data={manualpaymentmethodData}
                columns={columns}
                // paginationLinks={methods.links}
                onPageChange={(url) => Inertia.visit(url)}
                sortableColumns={["name"]}
                globalFilter={["name", "description"]}
            />
        </div>

        {data.showActivateConfirm && (
            <SweetAlert
                show={data.showActivateConfirm}
                confirm={true}
                message={`You're about to Mark this  Manual Payment Method Completed. Proceed?`}
                action={() =>
                    post(route("manual-payment-methods.activate", data.actionItem.id), {
                        onSuccess: () => {

                            setData(prev => ({ ...prev, showActivateConfirm: false, actionItem: null }));
                        },
                    })
                }
                cancel={() => setData(prev => ({ ...prev, showActivateConfirm: false, actionItem: null }))}
            />
        )}

        {data.showDeactivateConfirm && (
            <SweetAlert
                show={data.showDeactivateConfirm}
                confirm={true}
                message={`You're about to deactivate this Manual Payment Method. Proceed?`}
                action={() =>
                    post(route("manual-payment-methods.deactivate", data.actionItem.id), {
                        onSuccess: () => {

                            setData(prev => ({ ...prev, showDeactivateConfirm: false, actionItem: null }));
                        },
                    })
                }
                cancel={() => setData(prev => ({ ...prev, showDeactivateConfirm: false, actionItem: null }))}
            />
        )}

        {data.showDeleteConfirm && <SweetAlert show={data.showDeleteConfirm}  confirm={true} message={`You about Deleting this manualpaymentmethod. Are you sure you really want to delete this manualpaymentmethod?`} action={() => destroy(route("manual-payment-methods.destroy",data.id), {
            onSuccess: () => {
                setData('showDeleteConfirm', false)
            }
        })} cancel={() => setData(prev => ({...prev, showDeleteConfirm:false, id:null}))} />}
            </section>
            </div>
     </AppLayout>
    );
}
