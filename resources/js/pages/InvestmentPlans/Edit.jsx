
import React from 'react'
import InvestmentPlanForm from './InvestmentPlanForm'
import { Head, Link } from '@inertiajs/react'
import { HiChevronRight } from 'react-icons/hi'
import { HiStopCircle } from 'react-icons/hi2'
import AppLayout from '../../layouts/app-layout'

const Edit = ({categories, plan}) => {

   const breadcrumbs = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Celebrities Settings',
            href: '/celebrities',
        },
        {
            title: 'Edit Celebrity',
            href: '/celebrities/edit',
        },



    ];
  return (

<AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Celebrities Settings" />
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <section className="w-full h-full rounded-lg shadow shadow-slate-950 dark:shadow-slate-500 p-4">
        <InvestmentPlanForm investmentplan={plan} categories={categories} update={true} />
  </section>
</div>
    </AppLayout>
  )
}

export default Edit
