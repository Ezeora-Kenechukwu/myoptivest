
import React from 'react'
import ManualPaymentMethodForm from './ManualPaymentMethodForm'
import { Head, Link } from '@inertiajs/react'
import { HiChevronRight } from 'react-icons/hi'
import { HiStopCircle } from 'react-icons/hi2'
import AppLayout from '../../layouts/app-layout'

const Edit = ({method}) => {

   const breadcrumbs = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Manual Payment Method Settings',
            href: '/manual-payment-methods',
        },
        {
            title: 'Edit Payment Method',
            href: '/manual-payment-methods/edit',
        },



    ];
  return (

<AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Permission Settings" />
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <section className="w-full h-full rounded-lg shadow shadow-slate-950 dark:shadow-slate-500 p-4">
        <ManualPaymentMethodForm method={method} />
  </section>
</div>
    </AppLayout>
  )
}

export default Edit
