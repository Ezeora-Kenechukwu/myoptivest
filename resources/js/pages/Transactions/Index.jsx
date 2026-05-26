import React from 'react'
import AppLayout from '../../layouts/app-layout';
import { Head } from '@inertiajs/react';
import DataTable from "@/components/DataTable";
import { FaEye } from 'react-icons/fa6';
import DropdownComponent from "@/components/DropdownComponent";
import { FaEllipsisVertical } from "react-icons/fa6";
import StatusBadge from '@/components/StatusBadge';

const Index = ({user, transactions}) => {
    console.log(transactions, "transactions")
    const breadcrumbs = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ];

    const transactionColumns = [
  { name: "Transaction Id", selector: "id", sortable: true },
  { name: "Date", selector: "created_at", sortable: true },
  { name: "Category", selector: "category", sortable: true },
  { name: "Amount", selector: "amount", sortable: true },
  {
    name: "Status",
    selector: "status",
    sortable: true,
  },
  { name: "Type", selector: "type", sortable: true },
  { name: "Payment Method", selector: "payment_method", sortable: true },
  {
    name: "Action",
    selector: "action",
    sortable: false,
  },
];

const transactionsDetails =  transactions.data.map(item => {
    const { id,
    created_at,
    updated_at,
    category,
    amount,
    status,
    payment_method,
    type} = item

    return {
        ...item,
        status: <StatusBadge status={status} />,
        action: <DropdownComponent
        buttonText={<FaEllipsisVertical />}
        buttonClass={``}
        >
            <button className="flex items-center justify-center gap-2 cursor-pointer">
                <FaEye /> View
            </button>
             </DropdownComponent>,
    }
})
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transactions" />
            <section className="px-3 sm:px-5 lg:px-7">
                <div className="">
                                <h1 className='text-[#23272E] font-rubik font-[500] text-[20.97px] mb-5'>Recent Transactions</h1>
                               <DataTable
                  data={transactionsDetails}
                  columns={transactionColumns}
                  sortableColumns={["type", "category", "payment_method", "amount", "status"]}
                  globalFilter={["category", "payment_method", "type"]}
                />

                            </div>
            </section>
            </AppLayout>
  )
}

export default Index
