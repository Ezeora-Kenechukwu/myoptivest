import DataTable from "@/components/DataTable";
import DropdownComponent from "@/components/DropdownComponent";
import usePermissions from "@/hooks/usePermission";
import formatDate from "@/utils/formatDate";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { HiChevronRight } from "react-icons/hi";
import { HiMiniArrowTrendingDown, HiMiniArrowTrendingUp, HiStopCircle } from "react-icons/hi2";
import AppLayout from "../../layouts/app-layout";
import SweetAlert from "@/components/SweetAlert";
import { Button } from "@headlessui/react";
import ViewSavingsplan from "./ViewSavingsplan";
import Badge from "@/components/Badge";
import { useAbilities } from '@/hooks/useAbilities';
export default function Savingsplans({plans}) {
    // const {can_edit, can_delete, can_update} = usePlans("Savingsplan")
    console.log('====================================');
    console.log(plans);
    console.log('====================================');
    // console.log("can_edit/can_delete", can_delete, can_edit);
    const { abilities, checkAbility } = useAbilities('SavingsPlan');
    console.log("ABILITIES:", abilities);
const {data, setData, post, delete:destroy} = useForm({
    showAssignSavingsplan: false,
    showDeleteConfirm: false,
    showView: false,
    role:null,


showApproveConfirm: false,
showActivateConfirm: false,
showDeactivateConfirm: false,
id: null,
actionItem: null,

})
const handleView = (savingsplan) => {
    setData({...data, savingsplan:savingsplan,
        showView:true
    })
}

const handleApprove = (savingsplan) => {
    setData(prev => ({ ...prev, showApproveConfirm: true, actionItem: savingsplan }));
};

const handleActivate = (savingsplan) => {
    setData(prev => ({ ...prev, showActivateConfirm: true, actionItem: savingsplan }));
};

const handleDeactivate = (savingsplan) => {
    setData(prev => ({ ...prev, showDeactivateConfirm: true, actionItem: savingsplan }));
};
const handleDelete = (slug) => {
    setData(prev => ({ ...prev, showDeleteConfirm: true, id: slug }));
};

const columns = [
    { name: 'Name', selector: 'name', sortable: true },
    { name: 'Daily Amount', selector: 'daily_amount', sortable: true },
    { name: 'Target Amount', selector: 'target_amount', sortable: true },
    { name: 'Monthly Charge', selector: 'monthly_charge', sortable: true },
    { name: 'Type', selector: 'type', sortable: true },
    { name: 'Duration (days)', selector: 'duration', sortable: true },
    { name: 'Active', selector: 'active' },
    { name: 'Uploader', selector: 'uploader' },
    { name: 'Short Description', selector: 'short_description' },
    { name: 'Created At', selector: 'created_at' },
    { name: 'Updated At', selector: 'updated_at' },
    { name: 'Actions', selector: 'actions' },
];


console.log('=====plans===============================');
console.log(plans);
console.log('====================================');
const savingsplanData = plans?.map(plan => {
    const {
        name,
        slug,
        daily_amount,
        duration,
        target_amount,
        monthly_charge,
        type,
        short_description,
        active,
        creator,
        created_at,
        updated_at
    } = plan;

    return {
        name,
        daily_amount: `₦${daily_amount.toLocaleString()}`,
        target_amount: `₦${target_amount.toLocaleString()}`,
        monthly_charge: `₦${monthly_charge.toLocaleString()}`,
        type: type.charAt(0).toUpperCase() + type.slice(1),
        duration: `${duration} days`,
        active: <Badge status={active ? "active" : "inactive"} />,
        uploader: creator?.name || "—",
        short_description: short_description || "—",
        created_at: formatDate(created_at),
        updated_at: formatDate(updated_at),
        actions: (
            <DropdownComponent buttonText="Actions" buttonClass="bg-blue-600 text-white">
                {abilities?.can_view && (
                    <Button onClick={() => handleView(plan)} className="flex items-center gap-2 text-blue-700 text-sm">
                        <FaEye /> View
                    </Button>
                )}
                {abilities?.can_edit && (
                    <Link href={route("savings-plans.edit", slug)} className="flex gap-2 items-center text-yellow-700 text-sm">
                        <FaEdit /> Edit
                    </Link>
                )}
                {abilities?.can_delete && (
                    <Button onClick={() => handleDelete(slug)} className="flex gap-2 items-center text-red-600 text-sm">
                        <FaTrash /> Delete
                    </Button>
                )}
                {abilities?.can_update && !active && (
                    <Button onClick={() => handleActivate(plan)} className="flex gap-2 items-center text-green-700 text-sm">
                        <HiChevronRight /> Activate
                    </Button>
                )}
                {abilities?.can_update && active && (
                    <Button onClick={() => handleDeactivate(plan)} className="flex gap-2 items-center text-red-500 text-sm">
                        <HiStopCircle /> Deactivate
                    </Button>
                )}
            </DropdownComponent>
        ),
    };
}) || [];



        const breadcrumbs = [
            {
                title: 'Dashboard',
                href: '/dashboard',
            },
            {
                title: 'Savingsplan Settings',
                href: '/plans',
            },



        ];

    return (

     <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Savingsplan Settings" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center ">
                    <div className="flex flex-wrap gap-4 items-center justify-start mt-4 bg-[#F5F5F5] p-[8px] rounded-2xl">
                {
                    plans?.map(item => {
                        const {plan,invest_amount, creator} = item
                           return (
                                <article className="w-[270px] bg-white rounded-[8px] h-[100px] border border-[#E9EAEB] p-[12px] flex flex-col justify-between ">
                                    <h4 className="text-[#717680] font-inter font-[400px] text-[14px] space-y-5">
                                    Savings
                                    </h4>
                                    <div className="flex justify-between items-center">
                                        <h4 className='text-[#0A0D12] text-[24px] font-[400] font-inter'>{creator.savings_balance}</h4>
                                                  <div className="flex gap-2 items-center">
                                                    <p className={`flex text-[12px] items-center px-[4px] py-[2px] border rounded-[4px]  ${item.kpi_direction == 'up' ? "bg-[#ABEFC6] text-[#17B26A] border-[#ABEFC6]" : "bg-[#FECDCA] text-[#F04438] border-[#FECDCA]"}`}>
                                                      {item.kpi_direction == 'up' ? <HiMiniArrowTrendingUp />
                                                        : <HiMiniArrowTrendingDown  /> } {item.kpi}%
                                                                        </p>
                                                    <p className='text-[12px] font-[400] font-inter text-[#A4A7AE] '>vs {item.vs}</p>
                                                    </div>
                                </div>
                            </article>
                                )
                                })
                                }
                                </div>
                                <div className="">
                                    <button className="bg-[#533CD6] text-white py-3 px-4 rounded-lg">Create Saving</button>
                                </div>
                </div>
                <section className="w-full h-full rounded-lg shadow shadow-slate-950 dark:shadow-slate-500 p-4">
           <div className="p-6  rounded-xl">
            {abilities?.can_create && <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Plans</h1>
                <Link href={route("savings-plans.create")} className="bg-slate-500 text-white px-4 py-2 rounded-md hover:bg-slate-400 transition">
                    Create Savingsplan
                </Link>
            </div>}

            <DataTable
                data={savingsplanData}
                columns={columns}
                // paginationLinks={savings-plans.links}
                // onPageChange={(url) => Inertia.visit(url)}
                sortableColumns={["name"]}
                globalFilter={["name", "description"]}
            />
        </div>
        {data.showDeleteConfirm && (
    <SweetAlert
        show={data.showDeleteConfirm}
        confirm={true}
        message={`You're about to delete this savingsplan. Are you sure?`}
        action={() =>
            destroy(route("savings-plans.destroy", data.id), {
                onSuccess: () => {
                    setData(prev => ({ ...prev, showDeleteConfirm: false, id: null }));
                },
            })
        }
        cancel={() => setData(prev => ({ ...prev, showDeleteConfirm: false, id: null }))}
    />
)}

{data.showApproveConfirm && (
    <SweetAlert
        show={data.showApproveConfirm}
        confirm={true}
        message={`You're about to approve this savingsplan. Proceed?`}
        action={() =>
            post(route("savings-plans.approve", data.actionItem.slug), {
                onSuccess: () => {

                    setData(prev => ({ ...prev, showApproveConfirm: false, actionItem: null }));
                },
            })
        }
        cancel={() => setData(prev => ({ ...prev, showApproveConfirm: false, actionItem: null }))}
    />
)}

{data.showActivateConfirm && (
    <SweetAlert
        show={data.showActivateConfirm}
        confirm={true}
        message={`You're about to activate this savingsplan. Proceed?`}
        action={() =>
            post(route("savings-plans.activate", data.actionItem.slug), {
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
        message={`You're about to deactivate this savingsplan. Proceed?`}
        action={() =>
            post(route("savings-plans.deactivate", data.actionItem.slug), {
                onSuccess: () => {

                    setData(prev => ({ ...prev, showDeactivateConfirm: false, actionItem: null }));
                },
            })
        }
        cancel={() => setData(prev => ({ ...prev, showDeactivateConfirm: false, actionItem: null }))}
    />
)}


{data.showView && (
                <ViewSavingsplan
                    show={data.showView}
                    onClose={() => setData('showView', false)}
                    savingsplan={data.savingsplan}

                />
            )}
            </section>
            </div>
     </AppLayout>
    );
}
