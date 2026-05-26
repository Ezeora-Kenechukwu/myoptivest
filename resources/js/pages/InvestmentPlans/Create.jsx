
import React from 'react'
import InvestmentPlanForm from './InvestmentPlanForm'
import { Head, Link } from '@inertiajs/react'
import { HiChevronRight } from 'react-icons/hi'
import { HiStopCircle } from 'react-icons/hi2'
import AppLayout from '../../layouts/app-layout'

const Create = ({categories}) => {

    const breadcrumbs = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Category Settings',
            href: '/celebrities',
        },
        {
            title: 'Create Category',
            href: '/celebrities/create',
        },



    ];
  return (

<AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Category Settings" />
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <section className="w-full h-full rounded-lg shadow shadow-slate-950 dark:shadow-slate-500 p-4">
        <InvestmentPlanForm categories={categories} />

</section>
</div>
    </AppLayout>
  )
}

export default Create
