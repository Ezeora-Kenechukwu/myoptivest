import React from 'react';
import AppLayout from '../../../layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import StatusBadge from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/Datatable';
import formatDate from '@/utils/formatDate';

const loanColumns = [
  { name: 'ID', selector: 'id', sortable: true },
  { name: 'User', selector: 'user_name', sortable: true },
  { name: 'Amount', selector: 'amount', sortable: true },
  { name: 'Status', selector: 'status', sortable: true },
  { name: 'Created At', selector: 'created_at', sortable: true },
];

const LoanPlanShow = ({ loanPlan }) => {
  const loansDetails = loanPlan.loans.map((loan) => ({
    id: loan.id,
    user_name: loan.user?.name,
    amount: `₦${loan.amount.toLocaleString()}`,
    status: <StatusBadge status={loan.status} />,
    created_at: formatDate(loan.created_at),
  }));

  return (
    <AppLayout>
      <Head title={`Loan Plan: ${loanPlan.name}`} />
      <div className="p-4 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-rubik font-medium">{loanPlan.name}</h1>
          <Link href="/admin/loan-plans" className="text-[#533CD6] hover:underline">
            Back to Loan Plans
          </Link>
        </div>
        <div className="bg-background p-6 rounded-lg shadow">
          <p><strong>Minimum Amount:</strong> ₦{loanPlan.min_amount.toLocaleString()}</p>
          <p><strong>Maximum Amount:</strong> ₦{loanPlan.max_amount.toLocaleString()}</p>
          <p><strong>Interest Rate:</strong> {loanPlan.interest_rate}%</p>
          <p><strong>Duration:</strong> {loanPlan.duration} days</p>
          <p><strong>Minimum Profit Balance:</strong> ₦{loanPlan.min_profit_balance.toLocaleString()}</p>
          <p><strong>Loans Taken:</strong> {loanPlan.loans_count}</p>
          <p><strong>Status:</strong> <StatusBadge status={loanPlan.active ? 'Active' : 'Inactive'} /></p>
          <p><strong>Description:</strong> {loanPlan.description || 'N/A'}</p>
          <p><strong>Created By:</strong> {loanPlan.creator?.name}</p>
          <p><strong>Updated By:</strong> {loanPlan.updater?.name || 'N/A'}</p>
          <p><strong>Created At:</strong> {formatDate(loanPlan.created_at)}</p>
          <p><strong>Updated At:</strong> {formatDate(loanPlan.updated_at)}</p>
        </div>
        <h2 className="text-xl font-rubik font-medium mt-6 mb-4">Loans Taken</h2>
        <DataTable
          data={loansDetails}
          columns={loanColumns}
          sortableColumns={['id', 'user_name', 'amount', 'status', 'created_at']}
          globalFilter={['user_name']}
        />
      </div>
    </AppLayout>
  );
};

export default LoanPlanShow;
