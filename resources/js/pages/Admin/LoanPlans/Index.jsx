import React, { useState } from 'react';
import AppLayout from '../../../layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import DataTable from '@/components/Datatable';
import StatusBadge from '@/components/StatusBadge';
import { FaEye, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DropdownComponent from '@/components/DropdownComponent';
import formatDate from '@/utils/formatDate';

const loanPlanColumns = [
  { name: 'ID', selector: 'id', sortable: true },
  { name: 'Name', selector: 'name', sortable: true },
  { name: 'Min Amount', selector: 'min_amount', sortable: true },
  { name: 'Max Amount', selector: 'max_amount', sortable: true },
  { name: 'Interest Rate', selector: 'interest_rate', sortable: true },
  { name: 'Duration (Days)', selector: 'duration', sortable: true },
  { name: 'Min Profit Balance', selector: 'min_profit_balance', sortable: true },
  { name: 'Loans Taken', selector: 'loans_count', sortable: true },
  { name: 'Status', selector: 'active_status', sortable: true },
  { name: 'Action', selector: 'action', sortable: false },
];

const LoanPlansIndex = ({ loanPlans }) => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [toggleModalOpen, setToggleModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const { data, setData, post, put, delete: destroy, processing, errors } = useForm({
    name: '',
    min_amount: '',
    max_amount: '',
    interest_rate: '',
    duration: '',
    min_profit_balance: '',
    description: '',
    active: true,
  });

  const loanPlansDetails = loanPlans.map((plan) => ({
    id: plan.id,
    name: plan.name,
    min_amount: `₦${plan.min_amount.toLocaleString()}`,
    max_amount: `₦${plan.max_amount.toLocaleString()}`,
    interest_rate: `${plan.interest_rate}%`,
    duration: plan.duration,
    min_profit_balance: `₦${plan.min_profit_balance.toLocaleString()}`,
    loans_count: plan.loans_count,
    active_status: <StatusBadge status={plan.active ? 'Active' : 'Inactive'} />,
    action: (
      <DropdownComponent buttonText={<FaEllipsisVertical />} buttonClass="">
        <Link href={`/admin/loan-plans/${plan.slug}`} className="flex items-center gap-2">
          <FaEye /> View
        </Link>
        <button onClick={() => handleEdit(plan)} className="flex items-center gap-2">
          <FaEdit /> Edit
        </button>
        <button onClick={() => handleToggle(plan)} className="flex items-center gap-2">
          {plan.active ? <FaToggleOff /> : <FaToggleOn />} {plan.active ? 'Deactivate' : 'Activate'}
        </button>
        <button onClick={() => handleDelete(plan)} className="flex items-center gap-2 text-red-600">
          <FaTrash /> Delete
        </button>
      </DropdownComponent>
    ),
  }));

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setData({
      name: plan.name,
      min_amount: plan.min_amount,
      max_amount: plan.max_amount,
      interest_rate: plan.interest_rate,
      duration: plan.duration,
      min_profit_balance: plan.min_profit_balance,
      description: plan.description || '',
      active: plan.active,
    });
    setEditModalOpen(true);
  };

  const handleDelete = (plan) => {
    setSelectedPlan(plan);
    setDeleteModalOpen(true);
  };

  const handleToggle = (plan) => {
    setSelectedPlan(plan);
    setToggleModalOpen(true);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    post('/admin/loan-plans', {
      onSuccess: () => setCreateModalOpen(false),
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    put(`/admin/loan-plans/${selectedPlan.slug}`, {
      onSuccess: () => setEditModalOpen(false),
    });
  };

  const handleDeleteSubmit = () => {
    destroy(`/admin/loan-plans/${selectedPlan.id}`, {
      onSuccess: () => setDeleteModalOpen(false),
    });
  };

  const handleToggleSubmit = () => {
    post(`/admin/loan-plans/${selectedPlan.slug}/toggle-active`, {
      onSuccess: () => setToggleModalOpen(false),
    });
  };

  return (
    <AppLayout>
      <Head title="Loan Plans" />
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-rubik font-medium">Loan Plans</h1>
          <Button onClick={() => setCreateModalOpen(true)} className="bg-purple-700">Create Loan Plan</Button>
        </div>
        <DataTable
          data={loanPlansDetails}
          columns={loanPlanColumns}
          sortableColumns={['id', 'name', 'min_amount', 'max_amount', 'interest_rate', 'duration', 'min_profit_balance', 'loans_count', 'active_status']}
          globalFilter={['name']}
        />

        {/* Create Modal */}
        <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Loan Plan</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit} className="space-y-4 max-h-[500px] overflow-y-auto ">
              <div>
                <Label>Name</Label>
                <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
                {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
              </div>
              <div>
                <Label>Minimum Amount (₦)</Label>
                <Input type="number" value={data.min_amount} onChange={(e) => setData('min_amount', e.target.value)} />
                {errors.min_amount && <p className="text-red-600 text-sm">{errors.min_amount}</p>}
              </div>
              <div>
                <Label>Maximum Amount (₦)</Label>
                <Input type="number" value={data.max_amount} onChange={(e) => setData('max_amount', e.target.value)} />
                {errors.max_amount && <p className="text-red-600 text-sm">{errors.max_amount}</p>}
              </div>
              <div>
                <Label>Interest Rate (%)</Label>
                <Input type="number" step="0.01" value={data.interest_rate} onChange={(e) => setData('interest_rate', e.target.value)} />
                {errors.interest_rate && <p className="text-red-600 text-sm">{errors.interest_rate}</p>}
              </div>
              <div>
                <Label>Duration (Days)</Label>
                <Input type="number" value={data.duration} onChange={(e) => setData('duration', e.target.value)} />
                {errors.duration && <p className="text-red-600 text-sm">{errors.duration}</p>}
              </div>
              <div>
                <Label>Minimum Profit Balance (₦)</Label>
                <Input type="number" value={data.min_profit_balance} onChange={(e) => setData('min_profit_balance', e.target.value)} />
                {errors.min_profit_balance && <p className="text-red-600 text-sm">{errors.min_profit_balance}</p>}
              </div>
              <div>
                <Label>Description</Label>
                <textarea
                  className="w-full border rounded-lg p-2"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                />
                {errors.description && <p className="text-red-600 text-sm">{errors.description}</p>}
              </div>
              <div>
                <Label className="flex items-center">
                  <Input
                    type="checkbox"
                    checked={data.active}
                    onChange={(e) => setData('active', e.target.checked)}
                    className="mr-2"
                  />
                  Active
                </Label>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={processing}>Create</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Loan Plan</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4 max-h-[500px]">
              <div>
                <Label>Name</Label>
                <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
                {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
              </div>
              <div>
                <Label>Minimum Amount (₦)</Label>
                <Input type="number" value={data.min_amount} onChange={(e) => setData('min_amount', e.target.value)} />
                {errors.min_amount && <p className="text-red-600 text-sm">{errors.min_amount}</p>}
              </div>
              <div>
                <Label>Maximum Amount (₦)</Label>
                <Input type="number" value={data.max_amount} onChange={(e) => setData('max_amount', e.target.value)} />
                {errors.max_amount && <p className="text-red-600 text-sm">{errors.max_amount}</p>}
              </div>
              <div>
                <Label>Interest Rate (%)</Label>
                <Input type="number" step="0.01" value={data.interest_rate} onChange={(e) => setData('interest_rate', e.target.value)} />
                {errors.interest_rate && <p className="text-red-600 text-sm">{errors.interest_rate}</p>}
              </div>
              <div>
                <Label>Duration (Days)</Label>
                <Input type="number" value={data.duration} onChange={(e) => setData('duration', e.target.value)} />
                {errors.duration && <p className="text-red-600 text-sm">{errors.duration}</p>}
              </div>
              <div>
                <Label>Minimum Profit Balance (₦)</Label>
                <Input type="number" value={data.min_profit_balance} onChange={(e) => setData('min_profit_balance', e.target.value)} />
                {errors.min_profit_balance && <p className="text-red-600 text-sm">{errors.min_profit_balance}</p>}
              </div>
              <div>
                <Label>Description</Label>
                <textarea
                  className="w-full border rounded-lg p-2"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                />
                {errors.description && <p className="text-red-600 text-sm">{errors.description}</p>}
              </div>
              <div>
                <Label className="flex items-center">
                  <Input
                    type="checkbox"
                    checked={data.active}
                    onChange={(e) => setData('active', e.target.checked)}
                    className="mr-2"
                  />
                  Active
                </Label>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={processing}>Update</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Loan Plan</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the loan plan "{selectedPlan?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteSubmit} disabled={processing}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Toggle Active Confirmation Modal */}
        <Dialog open={toggleModalOpen} onOpenChange={setToggleModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedPlan?.active ? 'Deactivate' : 'Activate'} Loan Plan</DialogTitle>
              <DialogDescription>
                Are you sure you want to {selectedPlan?.active ? 'deactivate' : 'activate'} the loan plan "{selectedPlan?.name}"?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setToggleModalOpen(false)}>Cancel</Button>
              <Button onClick={handleToggleSubmit} disabled={processing}>
                {selectedPlan?.active ? 'Deactivate' : 'Activate'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default LoanPlansIndex;
