import React, { useState } from 'react';
import AppLayout from '../../layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { FiZap } from 'react-icons/fi';
import { MdArrowOutward } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LoanCreate = ({ loanPlans, totalProfitBalance, offers }) => {
  const { data, setData, post, processing, errors } = useForm({
    loan_plan_id: '',
    amount: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/loans');
  };

  return (
    <AppLayout>
      <Head title="Request Loan" />
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-rubik font-medium mb-4">Request a Loan</h1>
        <p className="text-gray-600 mb-4">
          Your total investment profit balance: ₦{totalProfitBalance.toLocaleString()}
        </p>
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
                    <Button
                      onClick={() => setData({ loan_plan_id: offer.loan_plan_id, amount: offer.max_loan_amount })}
                      className="mt-2"
                    >
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        {loanPlans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <FiZap className="text-4xl text-[#533DD7] mb-2" />
            <h1 className="text-xl font-normal">No Loan Plans Available</h1>
            <p className="text-gray-600 mb-4">Please check back later for available loan plans.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Select Loan Plan</Label>
              <select
                value={data.loan_plan_id}
                onChange={(e) => setData('loan_plan_id', e.target.value)}
                className="w-full border rounded-lg p-2"
              >
                <option value="">Select a plan</option>
                {loanPlans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} (₦{plan.min_amount.toLocaleString()} - ₦{plan.max_amount.toLocaleString()}, {plan.interest_rate}%, {plan.duration} days)
                  </option>
                ))}
              </select>
              {errors.loan_plan_id && <p className="text-red-600 text-sm">{errors.loan_plan_id}</p>}
            </div>
            <div>
              <Label>Loan Amount (₦)</Label>
              <Input
                type="number"
                value={data.amount}
                onChange={(e) => setData('amount', e.target.value)}
              />
              {errors.amount && <p className="text-red-600 text-sm">{errors.amount}</p>}
            </div>
            <Button type="submit" disabled={processing} className="flex items-center gap-2">
              Request Loan
              <MdArrowOutward />
            </Button>
          </form>
        )}
      </div>
    </AppLayout>
  );
};

export default LoanCreate;
