
import React from 'react'
import ReservationForm from './ReservationForm'
import { Head, Link } from '@inertiajs/react'
import { HiChevronRight } from 'react-icons/hi'
import { HiStopCircle } from 'react-icons/hi2'
import AppLayout from '../../layouts/app-layout'

const Edit = ({categories, reservation}) => {

   const breadcrumbs = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Reservations Settings',
            href: '/reservations',
        },
        {
            title: 'Edit Reservation',
            href: '/reservations/edit',
        },



    ];
  return (

<AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Reservations Settings" />
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <section className="w-full h-full rounded-lg shadow shadow-slate-950 dark:shadow-slate-500 p-4">
        <ReservationForm reservation={reservation} categories={categories} />
  </section>
</div>
    </AppLayout>
  )
}

export default Edit
