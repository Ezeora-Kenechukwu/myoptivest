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


export default function PermissionIndex({permissions}) {
    // const {can_edit, can_delete, can_update} = usePermissions("Permission")
    const { abilities, checkAbility } = useAbilities('Permission');
    // console.log("can_edit/can_delete", can_delete, can_edit);
const {data, setData, post, delete:destroy} = useForm({
    showAssignPermission: false,
    showDeleteConfirm: false,
    role:null,
id:'',

})

    const columns = [
        { name: 'Permission Name', selector: 'name', sortable: true, filterable: true, dataType: 'string' },
        { name: 'Description Name', selector: 'description', sortable: true, filterable: true, dataType: 'string' },
        { name: 'Created On', selector: 'created_at', sortable: true, filterable: true, dataType: 'string' },
        { name: 'Last Updated', selector: 'updated_at', sortable: true, filterable: true, dataType: 'string' },
        { name: 'Actions', selector: 'actions', sortable: false, filterable: true, dataType: 'string' },
    ];

    const permissionData = permissions?.data ?
    permissions.data.map((item, index) => {
            const { name, description, created_at, slug, updated_at,id } = item;
            return {
                name,
                description,

                created_at: formatDate(created_at),
                updated_at: formatDate(updated_at),
                actions:<DropdownComponent buttonText={"Actions"} buttonClass={`bg-red-500`}>

                {abilities.can_edit &&  <Link href={route("permissions.edit",slug)} className='flex gap-4 items-center text-xl'><FaEdit></FaEdit> Edit</Link>}

                {abilities.can_delete &&  <button className={`flex gap-4 items-center text-xl text-red-500`} onClick={() => setData(prev => ({...prev, showDeleteConfirm:true, id:slug}))}>
                    <FaTrash />
                    Delete
                    </button>}
                    {/* {
                       can_edit && <button className={`flex gap-4 items-center text-xl`} onClick={() => setData(prev => ({...prev, showAssignPermission:true, id:id, role:item}))}>
                        <FaAvianex />
                        Assign Permissions
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
                title: 'Permission Settings',
                href: '/schools',
            },



        ];

    return (

     <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permission Settings" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <section className="w-full h-full rounded-lg shadow shadow-slate-950 dark:shadow-slate-500 p-4">
           <div className="p-6  rounded-xl">
            {abilities.can_create && <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Permissions</h1>
                <Link href={route("permissions.create")} className="bg-slate-500 text-white px-4 py-2 rounded-md hover:bg-slate-400 transition">
                    Create Permission
                </Link>
            </div>}

            <DataTable
                data={permissionData}
                columns={columns}
                paginationLinks={permissions.links}
                onPageChange={(url) => Inertia.visit(url)}
                sortableColumns={["name"]}
                globalFilter={["name", "description"]}
            />
        </div>
        {data.showDeleteConfirm && <SweetAlert show={data.showDeleteConfirm}  confirm={true} message={`You about Deleting this permission. Are you sure you really want to delete this permission?`} action={() => destroy(route("permissions.destroy",data.id), {
            onSuccess: () => {
                setData('showDeleteConfirm', false)
            }
        })} cancel={() => setData(prev => ({...prev, showDeleteConfirm:false, id:null}))} />}
            </section>
            </div>
     </AppLayout>
    );
}
