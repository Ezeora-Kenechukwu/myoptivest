import React from 'react'
import RoleForm from './RoleForm'
import { HiChevronRight } from 'react-icons/hi'
import { Head, Link } from '@inertiajs/react'
import { HiStopCircle } from 'react-icons/hi2'
import AppLayout from '../../layouts/app-layout'

const Create = ({permissions,roles}) => {
      const breadcrumbs = [
            {
                title: 'Dashboard',
                href: '/dashboard',
            },
            {
                title: 'Role Settings',
                href: '/roles',
            },
            {
                title: 'Create Role',
                href: '/roles/create',
            },



        ];
  return (
   <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permission Settings" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <section className="w-full h-full rounded-lg shadow shadow-slate-950 dark:shadow-slate-500 p-4">
<RoleForm permissions={permissions} roles={roles}  />
     </section>
            </div>
     </AppLayout>
  )
}

export default Create
