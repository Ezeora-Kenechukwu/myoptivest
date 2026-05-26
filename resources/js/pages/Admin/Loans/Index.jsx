import React, { useState } from 'react';
import AppLayout from '../../../layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import DataTable from '@/components/Datatable';
import StatusBadge from '@/components/StatusBadge';
import {FaCheck, FaTimes } from 'react-icons/fa';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DropdownComponent from '@/components/DropdownComponent';
import formatDate from '@/utils/formatDate';

const loanColumns = [
  { name: 'ID', selector: 'id', sortable: true },
  { name: 'User', selector: 'user_name', sortable: true },
  { name: 'Loan Plan', selector: 'loan_plan_name', sortable: true },
  { name: 'Amount', selector: 'amount', sortable: true },
  { name: 'Interest Rate', selector: 'interest_rate', sortable: true },
  { name: 'Duration (Days)', selector: 'duration', sortable: true },
  { name: 'Total Repayment', selector: 'total_repayment', sortable: true },
  { name: 'Status', selector: 'status', sortable: true },
  { name: 'Action', selector: 'action', sortable: false },
];

const LoansIndex = ({ loans, notifications }) => {
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const { data, setData, post, processing, errors } = useForm({
    reason: '',
  });

  const loansDetails = loans.map((loan) => ({
    id: loan.id,
    user_name: loan.user?.name,
    loan_plan_name: loan.loanPlan?.name,
    amount: `₦${loan.amount.toLocaleString()}`,
    interest_rate: `${loan.interest_rate}%`,
    duration: loan.duration,
    total_repayment: `₦${loan.total_repayment.toLocaleString()}`,
    status: <StatusBadge status={loan.status} />,
    action: loan.status === 'pending' ? (
      <DropdownComponent buttonText={<FaEllipsisVertical />} buttonClass="">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            post(`/admin/loans/${loan.id}/approve`);
          }}
        >
          <Button type="submit" className="flex items-center gap-2 text-green-600">
            <FaCheck /> Approve
          </Button>
        </form>
        <Button onClick={() => handleReject(loan)} className="flex items-center gap-2 text-red-600">
          <FaTimes /> Reject
        </Button>
      </DropdownComponent>
    ) : null,
  }));

  const handleReject = (loan) => {
    setSelectedLoan(loan);
    setRejectModalOpen(true);
  };

  const handleRejectSubmit = (e) => {
    e.preventDefault();
    post(`/admin/loans/${selectedLoan.id}/reject`, {
      onSuccess: () => setRejectModalOpen(false),
    });
  };

  return (
    <AppLayout notifications={notifications}>
      <Head title="Loans" />
      <div className="p-4">
        <h1 className="text-2xl font-rubik font-medium mb-4">Loan Requests</h1>
        <DataTable
          data={loansDetails}
          columns={loanColumns}
          sortableColumns={['id', 'user_name', 'loan_plan_name', 'amount', 'interest_rate', 'duration', 'total_repayment', 'status']}
          globalFilter={['user_name', 'loan_plan_name']}
        />
        <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Loan</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting the loan request (ID: {selectedLoan?.id}).
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <Label>Reason</Label>
                <Input value={data.reason} onChange={(e) => setData('reason', e.target.value)} />
                {errors.reason && <p className="text-red-600 text-sm">{errors.reason}</p>}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setRejectModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="destructive" disabled={processing}>Reject</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default LoansIndex;
