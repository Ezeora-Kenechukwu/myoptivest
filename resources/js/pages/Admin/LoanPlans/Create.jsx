import React from 'react';
import AppLayout from '../../../layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

const LoanPlanCreate = () => {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    min_amount: '',
    max_amount: '',
    interest_rate: '',
    duration: '',
    min_profit_balance: '',
    description: '',
    active: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/admin/loan-plans');
  };

  return (
    <AppLayout>
      <Head title="Create Loan Plan" />
      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-rubik font-medium mb-4">Create Loan Plan</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              className="w-full border rounded-lg p-2"
            />
            {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Minimum Amount (₦)</label>
            <input
              type="number"
              value={data.min_amount}
              onChange={(e) => setData('min_amount', e.target.value)}
              className="w-full border rounded-lg p-2"
            />
            {errors.min_amount && <p className="text-red-600 text-sm">{errors.min_amount}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Maximum Amount (₦)</label>
            <input
              type="number"
              value={data.max_amount}
              onChange={(e) => setData('max_amount', e.target.value)}
              className="w-full border rounded-lg p-2"
            />
            {errors.max_amount && <p className="text-red-600 text-sm">{errors.max_amount}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Interest Rate (%)</label>
            <input
              type="number"
              step="0.01"
              value={data.interest_rate}
              onChange={(e) => setData('interest_rate', e.target.value)}
              className="w-full border rounded-lg p-2"
            />
            {errors.interest_rate && <p className="text-red-600 text-sm">{errors.interest_rate}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Duration (Days)</label>
            <input
              type="number"
              value={data.duration}
              onChange={(e) => setData('duration', e.target.value)}
              className="w-full border rounded-lg p-2"
            />
            {errors.duration && <p className="text-red-600 text-sm">{errors.duration}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Minimum Profit Balance (₦)</label>
            <input
              type="number"
              value={data.min_profit_balance}
              onChange={(e) => setData('min_profit_balance', e.target.value)}
              className="w-full border rounded-lg p-2"
            />
            {errors.min_profit_balance && <p className="text-red-600 text-sm">{errors.min_profit_balance}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              className="w-full border rounded-lg p-2"
            />
            {errors.description && <p className="text-red-600 text-sm">{errors.description}</p>}
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={data.active}
                onChange={(e) => setData('active', e.target.checked)}
                className="mr-2"
              />
              Active
            </label>
          </div>
          <button
            type="submit"
            disabled={processing}
            className="bg-[#533CD6] text-white px-4 py-2 rounded-lg"
          >
            Create
          </button>
        </form>
      </div>
    </AppLayout>
  );
};

export default LoanPlanCreate;
