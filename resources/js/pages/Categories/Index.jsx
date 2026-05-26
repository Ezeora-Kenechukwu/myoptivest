import DataTable from "@/components/DataTable";
import DropdownComponent from "@/components/DropdownComponent";
import usePermissions from "@/hooks/usePermission";
import formatDate from "@/utils/formatDate";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { HiChevronRight } from "react-icons/hi";
import { HiStopCircle } from "react-icons/hi2";
import AppLayout from "../../layouts/app-layout";
import SweetAlert from "@/components/SweetAlert";
import { useAbilities } from '@/hooks/useAbilities';

export default function InvestmentplanCategories({categories}) {
    const { abilities, checkAbility } = useAbilities('InvestmentPlanCategory');
    // const {can_edit, can_delete, can_update} = useCategories("Category")
    // console.log("can_edit/can_delete", can_delete, can_edit);
const {data, setData, post, delete:destroy} = useForm({
    showAssignCategory: false,
    showDeleteConfirm: false,
    role:null,
id:'',

})

    const columns = [
        { name: 'Category Name', selector: 'name', sortable: true, filterable: true, dataType: 'string' },
        { name: 'Description Name', selector: 'description', sortable: true, filterable: true, dataType: 'string' },
        { name: 'Created On', selector: 'created_at', sortable: true, filterable: true, dataType: 'string' },
        { name: 'Last Updated', selector: 'updated_at', sortable: true, filterable: true, dataType: 'string' },
        { name: 'Actions', selector: 'actions', sortable: false, filterable: true, dataType: 'string' },
    ];

    const categoryData = categories ?
    categories.map((item, index) => {
            const { name, description, created_at, slug, updated_at,id } = item;
            return {
                name,
                description,

                created_at: formatDate(created_at),
                updated_at: formatDate(updated_at),
                actions:<DropdownComponent buttonText={"Actions"} buttonClass={`bg-red-500`}>

                {abilities.can_edit &&  <Link href={route("investment-plan-categories.edit",slug)} className='flex gap-4 items-center text-xl'><FaEdit></FaEdit> Edit</Link>}

                {abilities.can_delete && <button className={`flex gap-4 items-center text-xl text-red-500`} onClick={() => setData(prev => ({...prev, showDeleteConfirm:true, id:slug}))}>
                    <FaTrash />
                    Delete
                    </button>}
                    {/* {
                       can_edit && <button className={`flex gap-4 items-center text-xl`} onClick={() => setData(prev => ({...prev, showAssignCategory:true, id:id, role:item}))}>
                        <FaAvianex />
                        Assign Categories
                        </button>
                    } */}
               {/* {!is_active ? <button className={`flex gap-4 items-center text-xl`} onClick={() => setShowAlerts(prev => ({...prev, showActivateConfirm:true, id:id}))}>
                    <FaEdit />
                    Activate
                    </button>
                   :
                   <button className={`flex gap-4 items-center text-xl text-red-500`} onClick={() => setShowAlerts(prev => ({...prev, showDeActivateConfirm:true, id:id}))}>
                   <FaEdit />
                   DeActivate
                   </button>
                    } */}
                    <p></p>
                </DropdownComponent>
            };
        })
        :
        [];

        const breadcrumbs = [
            {
                title: 'Dashboard',
                href: '/dashboard',
            },
            {
                title: 'Category Settings',
                href: '/investment-plan-categories',
            },



        ];

    return (

     <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Category Settings" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <section className="w-full h-full rounded-lg shadow shadow-slate-950 dark:shadow-slate-500 p-4">
           <div className="p-6  rounded-xl">
          {abilities.can_create &&   <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Categories</h1>
                <Link href={route("investment-plan-categories.create")} className="bg-slate-500 text-white px-4 py-2 rounded-md hover:bg-slate-400 transition">
                    Create Investment Plan Category
                </Link>
            </div>}

            <DataTable
                data={categoryData}
                columns={columns}
                // paginationLinks={categories.links}
                // onPageChange={(url) => Inertia.visit(url)}
                sortableColumns={["name"]}
                globalFilter={["name", "description"]}
            />
        </div>
        {data.showDeleteConfirm && <SweetAlert show={data.showDeleteConfirm}  confirm={true} message={`You about Deleting this category. Are you sure you really want to delete this category?`} action={() => destroy(route("investment-plan-categories.destroy",data.id), {
            onSuccess: () => {
                setData('showDeleteConfirm', false)
            }
        })} cancel={() => setData(prev => ({...prev, showDeleteConfirm:false, id:null}))} />}
            </section>
            </div>
     </AppLayout>
    );
}
