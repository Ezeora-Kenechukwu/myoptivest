import React from 'react'
import AppLayout from '../../layouts/app-layout'
import { Head } from '@inertiajs/react'
import { HiMiniArrowTrendingUp } from 'react-icons/hi2'

const Index = () => {
const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Investments', href: '/investments' },
];
  return (
     <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Investment" />


      </AppLayout>
  )
}

export default Index
