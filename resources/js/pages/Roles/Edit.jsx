import React from 'react'
import RoleForm from './RoleForm'
import { Head, Link } from '@inertiajs/react'
import { HiChevronRight } from 'react-icons/hi'
import { HiStopCircle } from 'react-icons/hi2'
import AppLayout from '../../layouts/app-layout'

const Edit = ({role,
    permissions,
    roles}) => {
        console.log(role);
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
                title: 'Edit Role',
                href: '/roles/edit',
            },



        ];
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Role Settings" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <section className="w-full h-full rounded-lg shadow shadow-slate-950 dark:shadow-slate-500 p-4">
    <RoleForm permissions={permissions} roles={roles} role={role}  />
      </section>
            </div>
     </AppLayout>
  )
}

export default Edit
