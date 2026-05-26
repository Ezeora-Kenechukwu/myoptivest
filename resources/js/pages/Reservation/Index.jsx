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
import ViewReservation from "./ViewReservation";
import Badge from "@/components/Badge";
import InputError from "@/components/InputError";
import InputLabel from "@/components/InputLabel";
import TextArea from "@/components/TextArea";
import TextInput from "@/components/TextInput";
import { useAbilities } from '@/hooks/useAbilities';

export default function Reservations({reservations}) {
    // const {can_edit, can_delete, can_update} = useReservations("Reservation")
    const { abilities, checkAbility } = useAbilities('Reservation');
    // console.log("can_edit/can_delete", can_delete, can_edit);
const {data, setData, post, delete:destroy, errors, processing} = useForm({
    showAssignReservation: false,
    showDeleteConfirm: false,
    showView: false,
    telegram_link: '',
    role:null,


showApproveConfirm: false,
showActivateConfirm: false,
showDeactivateConfirm: false,
id: null,
actionItem: null,

})
const handleView = (reservation) => {
    setData({...data, reservation:reservation,
        showView:true
    })
}

const handleApprove = (reservation) => {
    setData(prev => ({ ...prev, showApproveConfirm: true, actionItem: reservation }));
};

const handleActivate = (reservation) => {
    setData(prev => ({ ...prev, showActivateConfirm: true, actionItem: reservation }));
};

const handleDeactivate = (reservation) => {
    setData(prev => ({ ...prev, showDeactivateConfirm: true, actionItem: reservation }));
};

const columns = [
    { name: 'Occassion Type', selector: 'name', sortable: true, filterable: true, dataType: 'string' },
    { name: 'Celebrity', selector: 'celebrity', sortable: true, filterable: true, dataType: 'string' },
    { name: 'Booking Amount', selector: 'booking_amount', sortable: true, filterable: true, dataType: 'string' },
    { name: 'Event Data', selector: 'event_date', sortable: true, filterable: true, dataType: 'boolean' },
    { name: 'Event Time', selector: 'event_time', sortable: true, filterable: true, dataType: 'boolean' },
    { name: 'Event Duration', selector: 'event_duration', sortable: true, filterable: true, dataType: 'boolean' },
    { name: 'Event Location', selector: 'event_location', sortable: true, filterable: true, dataType: 'string' },
    { name: 'Event State', selector: 'event_state', sortable: true, filterable: true, dataType: 'string' },
    { name: 'Event City', selector: 'event_city', sortable: true, filterable: true, dataType: 'string' },
    { name: 'Nearest LandMark', selector: 'nearest_landmark', sortable: true, filterable: true, dataType: 'string' },
    { name: 'Nearest Police Station', selector: 'nearest_police_station', sortable: true, filterable: true, dataType: 'string' },
    { name: 'Status', selector: 'status', sortable: true, filterable: true, dataType: 'string' },

    { name: 'Created On', selector: 'created_at', sortable: true, filterable: true, dataType: 'string' },
    { name: 'Updated At', selector: 'updated_at', sortable: true, filterable: true, dataType: 'string' },
    { name: 'Actions', selector: 'actions', sortable: false, filterable: false, dataType: 'string' },
];
console.log('=====reservations===============================');
console.log(reservations);
console.log('====================================');
const reservationData = reservations ? reservations.map((item) => {
    const {
        name,
        bio,
        amount,
        occasion_type,
        event_date,
        event_time,
        event_duration,
        event_location,
        event_state,
        event_city,
        nearest_landmark,
        nearest_police_station,
        created_at,
        updated_at,
        id,
        slug,
        category,
        status,
        celebrity,
        active,
        featured,
        popular,
        new: isNew,
        uploader
    } = item;

    return {
        name:occasion_type,
        celebrity: celebrity?.name,
        event_date: formatDate(event_date),
        event_time: event_time,
        event_duration: event_duration,
        event_location: event_location,
        event_state: event_state,
        event_city: event_city,
        nearest_landmark: nearest_landmark,
        nearest_police_station: nearest_police_station,
        booking_amount: `${celebrity.currency_position === 'left' ? celebrity.currency : ''}${amount}${celebrity.currency_position === 'right' ? celebrity.currency : ''}`,
        status: <Badge status={status} />,
        active: <Badge status={active ? "active" : "inactive"} />,
        featured: featured ? "Yes" : "No",
        popular: popular ? "Yes" : "No",
        uploader: uploader?.name || "—",
        bio_preview: <span dangerouslySetInnerHTML={{ __html: bio?.slice(0, 80) + "..." }} />,
        created_at: formatDate(created_at),
        updated_at: formatDate(updated_at),
        actions: (
            <DropdownComponent buttonText="Actions" buttonClass="bg-blue-600 text-white">
                {abilities.can_view && <Button onClick={() => handleView(item)} className="flex items-center gap-2 text-blue-700 text-sm">
                    <FaEye /> View
                </Button>}

               {abilities.can_edit && <Link href={route("reservations.edit", slug)} className="flex gap-2 items-center text-sm text-yellow-700">
                    <FaEdit /> Edit
                </Link>}

               {abilities.can_delete && <Button onClick={() => setData(prev => ({ ...prev, showDeleteConfirm: true, id: slug }))} className="flex gap-2 items-center text-sm text-red-600">
                    <FaTrash /> Cancel
                </Button>}

                {abilities.can_approve &&  status !== "approved" && (
                    <Button onClick={() => handleApprove(item)} className="flex gap-2 items-center text-sm text-green-700">
                        <HiChevronRight /> Approve
                    </Button>
                )}

                {abilities.can_approve &&  status == "approved"  && (
                    <Button onClick={() => handleActivate(item)} className="flex gap-2 items-center text-sm text-green-700">
                        <HiChevronRight /> Mark Completed
                    </Button>
                )}
                {/* {active && (
                    <Button onClick={() => handleDeactivate(item)} className="flex gap-2 items-center text-sm text-red-500">
                        <HiStopCircle /> Deactivate
                    </Button>
                )} */}
            </DropdownComponent>
        ),
    };
}) : [];


        const breadcrumbs = [
            {
                title: 'Dashboard',
                href: '/dashboard',
            },
            {
                title: 'Reservation Settings',
                href: '/reservations',
            },



        ];

    return (

     <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reservation Settings" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <section className="w-full h-full rounded-lg shadow shadow-slate-950 dark:shadow-slate-500 p-4">
           <div className="p-6  rounded-xl">
           { abilities.can_create && <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Reservations</h1>
                <Link href={route("reservations.create")} className="bg-slate-500 text-white px-4 py-2 rounded-md hover:bg-slate-400 transition">
                    Create Reservation
                </Link>
            </div>}

            <DataTable
                data={reservationData}
                columns={columns}
                // paginationLinks={reservations.links}
                // onPageChange={(url) => Inertia.visit(url)}
                sortableColumns={["name"]}
                globalFilter={["name", "description"]}
            />
        </div>
        {data.showDeleteConfirm && (
    <SweetAlert
        show={data.showDeleteConfirm}
        confirm={true}
        message={`You're about to Cancel this reservation. Are you sure?`}
        action={() =>
            destroy(route("reservations.cancel", data.id), {
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
        message={`You're about to approve this reservation. Proceed?`}
        action={() =>
            post(route("reservations.approve", data.actionItem.slug), {
                onSuccess: () => {

                    setData(prev => ({ ...prev, showApproveConfirm: false, actionItem: null }));
                },
            })
        }
        cancel={() => setData(prev => ({ ...prev, showApproveConfirm: false, actionItem: null }))}
    >
         {/* Nearest Police Station */}
            <div>
                <InputLabel htmlFor="telegram_link">Add Telegram Link to Direct the Client to Via Mail</InputLabel>
                <TextInput
                    type="url"
                    value={data.telegram_link}
                    onChange={(e) => setData("telegram_link", e.target.value)}
                    className="w-full py-2 px-4 rounded dark:bg-gray-700 dark:text-white mb-2"
                />
                <InputError message={errors.telegram_link} />
            </div>
    </SweetAlert>
)}

{data.showActivateConfirm && (
    <SweetAlert
        show={data.showActivateConfirm}
        confirm={true}
        message={`You're about to Mark this reservation Completed. Proceed?`}
        action={() =>
            post(route("reservations.complete", data.actionItem.slug), {
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
        message={`You're about to deactivate this reservation. Proceed?`}
        action={() =>
            post(route("reservations.deactivate", data.actionItem.slug), {
                onSuccess: () => {

                    setData(prev => ({ ...prev, showDeactivateConfirm: false, actionItem: null }));
                },
            })
        }
        cancel={() => setData(prev => ({ ...prev, showDeactivateConfirm: false, actionItem: null }))}
    />
)}


{data.showView && (
                <ViewReservation
                    show={data.showView}
                    onClose={() => setData('showView', false)}
                    reservation={data.reservation}

                />
            )}
            </section>
            </div>
     </AppLayout>
    );
}
