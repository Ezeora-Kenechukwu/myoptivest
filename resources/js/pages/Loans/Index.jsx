import React, { useState } from 'react';
import AppLayout from '../../layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import { FaTimes } from 'react-icons/fa';
import { FaEllipsisVertical} from 'react-icons/fa6';
import {  MdArrowOutward} from 'react-icons/md';
import {  FiZap} from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DropdownComponent from '@/components/DropdownComponent';
import formatDate from '@/utils/formatDate';

const loanColumns = [
  { name: 'ID', selector: 'id', sortable: true },
  { name: 'Loan Plan', selector: 'loan_plan_name', sortable: true },
  { name: 'Amount', selector: 'amount', sortable: true },
  { name: 'Interest Rate', selector: 'interest_rate', sortable: true },
  { name: 'Duration (Days)', selector: 'duration', sortable: true },
  { name: 'Total Repayment', selector: 'total_repayment', sortable: true },
  { name: 'Status', selector: 'status', sortable: true },
  { name: 'Action', selector: 'action', sortable: false },
];

const LoansIndex = ({ loans, offers, notifications }) => {
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const { data, setData, post, processing, errors } = useForm({
    amount: '',
  });

  const loansDetails = loans.map((loan) => ({
    id: loan.id,
    loan_plan_name: loan.loanPlan?.name,
    amount: `₦${loan.amount.toLocaleString()}`,
    interest_rate: `${loan.interest_rate}%`,
    duration: loan.duration,
    total_repayment: `₦${loan.total_repayment.toLocaleString()}`,
    status: <StatusBadge status={loan.status} />,
    action: (
      <DropdownComponent buttonText={<FaEllipsisVertical />} buttonClass="">
        {loan.status === 'pending' && (
          <Button onClick={() => handleCancel(loan)} className="flex items-center gap-2 text-red-600">
            <FaTimes /> Cancel
          </Button>
        )}
        {(loan.status === 'disbursed' || loan.status === 'overdue') && (
          <Button onClick={() => handlePay(loan)} className="flex items-center gap-2">
            Make Payment
          </Button>
        )}
      </DropdownComponent>
    ),
  }));

  const handleCancel = (loan) => {
    setSelectedLoan(loan);
    setCancelModalOpen(true);
  };

  const handlePay = (loan) => {
    setSelectedLoan(loan);
    setPayModalOpen(true);
  };

  const handleCancelSubmit = () => {
    post(`/loans/${selectedLoan.id}/cancel`, {
      onSuccess: () => setCancelModalOpen(false),
    });
  };

  const handlePaySubmit = (e) => {
    e.preventDefault();
    post(`/loans/${selectedLoan.id}/pay`, {
      onSuccess: () => setPayModalOpen(false),
    });
  };

  return (
    <AppLayout notifications={notifications}>
      <Head title="My Loans" />
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-rubik font-medium">My Loans</h1>
          <Link
            href="/loans/create"
            className="bg-[#533CD6] text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            Request Loan
            <MdArrowOutward />
          </Link>
        </div>
        {offers.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-rubik font-medium mb-2">Personalized Loan Offers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {offers.map((offer) => (
                <Card key={offer.loan_plan_id}>
                  <CardHeader>
                    <CardTitle>{offer.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p><strong>Max Loan Amount:</strong> ₦{offer.max_loan_amount.toLocaleString()}</p>
                    <p><strong>Interest Rate:</strong> {offer.interest_rate}%</p>
                    <p><strong>Duration:</strong> {offer.duration} days</p>
                    <Link
                      href="/loans/create"
                      className="mt-2 inline-block bg-[#533CD6] text-white px-4 py-2 rounded-lg"
                    >
                      Apply Now
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        <DataTable
          data={loansDetails}
          columns={loanColumns}
          sortableColumns={['id', 'loan_plan_name', 'amount', 'interest_rate', 'duration', 'total_repayment', 'status']}
          globalFilter={['loan_plan_name']}
          emptyInfo={
            <div className="flex flex-col items-center justify-center py-10">
              <FiZap className="text-4xl text-[#533DD7] mb-2" />
              <h1 className="text-xl font-normal">No Loans Yet</h1>
              <p className="text-gray-600 mb-4">Request a loan to get started.</p>
              <Link
                href="/loans/create"
                className="bg-[#533CD6] text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                Request Loan
                <MdArrowOutward />
              </Link>
            </div>
          }
        />
        <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Loan</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel the loan request (ID: {selectedLoan?.id})?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCancelModalOpen(false)}>Cancel</Button>
              <Button onClick={handleCancelSubmit} disabled={processing}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={payModalOpen} onOpenChange={setPayModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Make Loan Payment</DialogTitle>
              <DialogDescription>
                Enter the amount to pay for the loan (ID: {selectedLoan?.id}).
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePaySubmit} className="space-y-4">
              <div>
                <Label>Payment Amount (₦)</Label>
                <Input
                  type="number"
                  value={data.amount}
                  onChange={(e) => setData('amount', e.target.value)}
                />
                {errors.amount && <p className="text-red-600 text-sm">{errors.amount}</p>}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPayModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={processing}>Pay</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default LoansIndex;
