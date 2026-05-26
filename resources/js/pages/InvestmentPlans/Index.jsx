import DataTable from "@/components/DataTable";
import DropdownComponent from "@/components/DropdownComponent";
import usePermissions from "@/hooks/usePermission";
import formatDate from "@/utils/formatDate";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { HiChevronRight } from "react-icons/hi";
import { HiStopCircle } from "react-icons/hi2";
import AppLayout from "../../layouts/app-layout";
import SweetAlert from "@/components/SweetAlert";
import { Button } from "@headlessui/react";
import ViewInvestmentPlan from "./ViewInvestmentPlan";
import Badge from "@/components/Badge";
import { useAbilities } from '@/hooks/useAbilities';
export default function Investmentplans({plans}) {
    // const {can_edit, can_delete, can_update} = usePlans("InvestmentPlan")
    console.log('====================================');
    console.log(plans);
    console.log('====================================');
    // console.log("can_edit/can_delete", can_delete, can_edit);
    const { abilities, checkAbility } = useAbilities('InvestmentPlan');
const {data, setData, post, delete:destroy} = useForm({
    showAssignInvestmentPlan: false,
    showDeleteConfirm: false,
    showView: false,
    role:null,


showApproveConfirm: false,
showActivateConfirm: false,
showDeactivateConfirm: false,
id: null,
actionItem: null,

})
const handleView = (investmentplan) => {
    setData({...data, investmentplan:investmentplan,
        showView:true
    })
}

const handleApprove = (investmentplan) => {
    setData(prev => ({ ...prev, showApproveConfirm: true, actionItem: investmentplan }));
};

const handleActivate = (investmentplan) => {
    setData(prev => ({ ...prev, showActivateConfirm: true, actionItem: investmentplan }));
};

const handleDeactivate = (investmentplan) => {
    setData(prev => ({ ...prev, showDeactivateConfirm: true, actionItem: investmentplan }));
};
const handleDelete = (slug) => {
    setData(prev => ({ ...prev, showDeleteConfirm: true, id: slug }));
};

const columns = [
    { name: 'Name', selector: 'name', sortable: true },
    { name: 'Min Amount', selector: 'min_amount', sortable: true },
    { name: 'Max Amount', selector: 'max_amount', sortable: true },
    { name: 'ROI (%)', selector: 'roi', sortable: true },
    { name: 'Duration (hours)', selector: 'duration', sortable: true },
    { name: 'Payout Frequency', selector: 'payout_frequency' },
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
const investmentplanData = plans?.map(plan => {
    const {
        id, name, slug, min_amount, max_amount, roi, duration, payout_frequency,
        short_description, active, creator, created_at, updated_at
    } = plan;

    return {
        name,
        min_amount: `₦${min_amount.toLocaleString()}`,
        max_amount: max_amount ? `₦${max_amount.toLocaleString()}` : "No Max",
        roi: `${roi}%`,
        duration: `${duration} hours`,
        payout_frequency: payout_frequency || "—",
        active: <Badge status={active ? "active" : "inactive"} />,
        uploader: creator?.name || "—",
        short_description: short_description || "—",
        created_at: formatDate(created_at),
        updated_at: formatDate(updated_at),
        actions: (
            <DropdownComponent buttonText="Actions" buttonClass="bg-blue-600 text-white">
                {abilities.can_view && (
                    <Button onClick={() => handleView(plan)} className="flex items-center gap-2 text-blue-700 text-sm">
                        <FaEye /> View
                    </Button>
                )}
                {abilities.can_edit && (
                    <Link href={route("investment-plans.edit", slug)} className="flex gap-2 items-center text-yellow-700 text-sm">
                        <FaEdit /> Edit
                    </Link>
                )}
                {abilities.can_delete && (
                    <Button onClick={() => handleDelete(slug)} className="flex gap-2 items-center text-red-600 text-sm">
                        <FaTrash /> Delete
                    </Button>
                )}
                {/* {abilities.can_approve && plan.status !== "approved" && (
                    <Button onClick={() => handleApprove(plan)} className="flex gap-2 items-center text-green-700 text-sm">
                        <HiChevronRight /> Approve
                    </Button>
                )} */}
                {abilities.can_update && !active && (
                    <Button onClick={() => handleActivate(plan)} className="flex gap-2 items-center text-green-700 text-sm">
                        <HiChevronRight /> Activate
                    </Button>
                )}
                {abilities.can_update && active && (
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
                title: 'InvestmentPlan Settings',
                href: '/plans',
            },



        ];

    return (

     <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="InvestmentPlan Settings" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <section className="w-full h-full rounded-lg shadow shadow-slate-950 dark:shadow-slate-500 p-4">
           <div className="p-6  rounded-xl">
            {abilities.can_create && <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Plans</h1>
                <Link href={route("investment-plans.create")} className="bg-slate-500 text-white px-4 py-2 rounded-md hover:bg-slate-400 transition">
                    Create InvestmentPlan
                </Link>
            </div>}

            <DataTable
                data={investmentplanData}
                columns={columns}
                // paginationLinks={investment-plans.links}
                // onPageChange={(url) => Inertia.visit(url)}
                sortableColumns={["name"]}
                globalFilter={["name", "description"]}
            />
        </div>
        {data.showDeleteConfirm && (
    <SweetAlert
        show={data.showDeleteConfirm}
        confirm={true}
        message={`You're about to delete this investmentplan. Are you sure?`}
        action={() =>
            destroy(route("investment-plans.destroy", data.id), {
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
        message={`You're about to approve this investmentplan. Proceed?`}
        action={() =>
            post(route("investment-plans.approve", data.actionItem.slug), {
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
        message={`You're about to activate this investmentplan. Proceed?`}
        action={() =>
            post(route("investment-plans.activate", data.actionItem.slug), {
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
        message={`You're about to deactivate this investmentplan. Proceed?`}
        action={() =>
            post(route("investment-plans.deactivate", data.actionItem.slug), {
                onSuccess: () => {

                    setData(prev => ({ ...prev, showDeactivateConfirm: false, actionItem: null }));
                },
            })
        }
        cancel={() => setData(prev => ({ ...prev, showDeactivateConfirm: false, actionItem: null }))}
    />
)}


{data.showView && (
                <ViewInvestmentPlan
                    show={data.showView}
                    onClose={() => setData('showView', false)}
                    investmentplan={data.investmentplan}

                />
            )}
            </section>
            </div>
     </AppLayout>
    );
}
