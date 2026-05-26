import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { HiMiniArrowTrendingDown, HiMiniArrowTrendingUp } from 'react-icons/hi2';
import DataTable from "@/components/DataTable";
import StatusBadge from '@/components/StatusBadge';
import { FaEllipsisVertical, FaEye } from 'react-icons/fa6';
import DropdownComponent from "@/components/DropdownComponent";
import { FiZap } from "react-icons/fi";
import { MdArrowOutward } from 'react-icons/md';
import formatDate from "@/utils/formatDate";
import { TbArrowBearRight } from "react-icons/tb";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const transactionColumns = [
  { name: "S/N", selector: "id", sortable: true },
  { name: "User", selector: "user_name", sortable: true },
  { name: "Date", selector: "created_at", sortable: true },
  { name: "Savings Name", selector: "name", sortable: true },
  { name: "Target Amount", selector: "target_amount", sortable: true },
  { name: "Amount Per Day", selector: "amount_per_day", sortable: true },
  { name: "Contribution Type", selector: "type", sortable: true },
  { name: "Start Date", selector: "start_date", sortable: true },
  { name: "End Date", selector: "end_date", sortable: true },
  { name: "Status", selector: "status", sortable: true },
  { name: "Action", selector: "action", sortable: false },
];

const dailySavingsColumns = [
  { name: "S/N", selector: "id", sortable: true },
  { name: "Date", selector: "date", sortable: true },
  { name: "Amount", selector: "amount", sortable: true },
  { name: "Type", selector: "type", sortable: true },
  { name: "Created At", selector: "created_at", sortable: true },
];

const Index = ({ breadcrumbs, auth, savings, plans, users }) => {
  const { flash } = usePage().props;
  const [selectedSaving, setSelectedSaving] = useState(null);
console.log('================user savings====================');
console.log(auth);
console.log('=================user savings===================');
  const { data, setData, post, processing, errors, reset } = useForm({
    saving_plan_id: '',
    name: '',
    start_date: '',
    end_date: '',
    amount_per_day: '',
    targeted_amount: '',
    type: 'manual',
    user_id: '',
    showAddSavingModal: false,
  });

  // Auto-fill amount_per_day when a plan is selected
  useEffect(() => {
    if (data.saving_plan_id) {
      const selectedPlan = plans.find(plan => plan.id.toString() === data.saving_plan_id);
      if (selectedPlan) {
        setData('amount_per_day', selectedPlan.daily_amount.toString());
      }
    } else {
      setData('amount_per_day', '');
    }
  }, [data.saving_plan_id, plans]);

  // Auto-calculate targeted_amount and validate dates
  useEffect(() => {
    if (data.start_date && data.end_date && data.amount_per_day) {
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);
      if (endDate < startDate) {
        setData('targeted_amount', '');
        return;
      }
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      const calculatedTarget = parseFloat(data.amount_per_day) * diffDays;
      setData('targeted_amount', calculatedTarget.toFixed(2));
    } else {
      setData('targeted_amount', '');
    }
  }, [data.start_date, data.end_date, data.amount_per_day]);

  const handleAddSaving = () => {
    setData({ ...data, showAddSavingModal: true });
  };

  const handleCloseModal = () => {
    setData({ ...data, showAddSavingModal: false });
    reset();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('savings.store'), {
      onSuccess: () => {
        handleCloseModal();
      },
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleViewSaving = (savingId) => {
    setSelectedSaving(savings.data.find((saving) => saving.id === savingId) || null);
  };

  const handleCloseViewModal = () => {
    setSelectedSaving(null);
  };

  const handleApprove = (savingId) => {
    post(route('savings.approve', savingId), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => setSelectedSaving(null),
    });
  };

  const handleCancel = (savingId) => {
    post(route('savings.cancel', savingId), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => setSelectedSaving(null),
    });
  };

  const savingsDetails = savings.data.length > 0
    ? savings.data.map(item => ({
        id: item.id,
        user_name: item.user?.name || 'Unknown',
        created_at: formatDate(item.created_at),
        name: item.name,
        target_amount: `₦${(item.targeted_amount).toLocaleString()}`,
        amount_per_day: `₦${(item.amount_per_day).toLocaleString()}`,
        type: item.type,
        start_date: formatDate(item.start_date),
        end_date: formatDate(item.end_date),
        status: <StatusBadge status={item.status} />,
        action: (
          <DropdownComponent buttonText={<FaEllipsisVertical />}>
            <button
              onClick={() => handleViewSaving(item.id)}
              className="flex items-center justify-center gap-2 cursor-pointer w-full text-left px-2 py-1"
            >
              <FaEye /> View
            </button>
            <Link
              href={route('savings.cancel', item.id)}
              method="post"
              as="button"
              className="flex items-center justify-center gap-2 cursor-pointer w-full text-left px-2 py-1"
            >
              Cancel
            </Link>
          </DropdownComponent>
        ),
      }))
    : [];

  const selectedDailySavings = selectedSaving?.dailySavings || selectedSaving?.daily_savings || [];
  const dailySavingsDetails = selectedDailySavings.length > 0
    ? selectedDailySavings.map(item => ({
        id: item.id,
        date: formatDate(item.date),
        amount: `₦${(item.amount).toLocaleString()}`,
        type: item.type,
        created_at: formatDate(item.created_at),
      }))
    : [];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Savings" />
      <div className="p-5">
        {flash.success && <div className="alert alert-success mb-4">{flash.success}</div>}
        {flash.error && <div className="alert alert-danger mb-4">{flash.error}</div>}
        <div className="flex justify-end py-5">
          <Button onClick={handleAddSaving} className="w-[179px] h-[51px] rounded-[10px] bg-[#533CD6] border-[#513DD6] flex gap-3 items-center font-black text-white">
            Add Savings <TbArrowBearRight />
          </Button>
        </div>
        <div className="flex flex-wrap gap-4 items-center justify-start mt-4 p-[8px] rounded-2xl">
          {savings.data.map(item => (
            <article key={item.id} className="w-[270px] bg-[#FDFDFD] rounded-[8px] h-[100px] border border-[#E9EAEB] p-[12px] flex flex-col justify-between">
              <h4 className="text-[#717680] font-inter font-[400] text-[14px]">
                {item.name}
              </h4>
              <div className="flex justify-between items-center">
                <h4 className="text-[#0A0D12] text-[24px] font-[400] font-inter">
                  ₦{item.targeted_amount.toLocaleString()}
                </h4>
                <div className="flex gap-2 items-center">
                  <p className={`flex text-[12px] items-center px-[4px] py-[2px] border rounded-[4px] ${item.kpi_direction === 'up' ? "bg-[#ABEFC6] text-[#17B26A] border-[#ABEFC6]" : "bg-[#FECDCA] text-[#F04438] border-[#FECDCA]"}`}>
                    {item.kpi_direction === 'up' ? <HiMiniArrowTrendingUp /> : <HiMiniArrowTrendingDown />} {item.kpi}%
                  </p>
                  <p className="text-[12px] font-[400] font-inter text-[#A4A7AE]">vs {item.vs}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="p-[8px]">
          <h1 className="text-[#23272E] font-rubik font-[500] text-[20.97px] mb-5">Recent Saving</h1>
          <DataTable
            data={savingsDetails}
            columns={transactionColumns}
            sortableColumns={["id", "user_name", "created_at", "name", "target_amount", "amount_per_day", "type", "start_date", "end_date", "status"]}
            globalFilter={["name", "user_name"]}
            emptyInfo={
              <div className="text-center py-4">
                <p className="text-[#717680]">No savings records available.</p>
              </div>
            }
          />
        </div>
      </div>

      {/* Add Savings Modal */}
      <Dialog open={data.showAddSavingModal} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Saving</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="user_id">Select User</Label>
              <Select
                value={data.user_id}
                onValueChange={(value) => setData('user_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.user_id && <p className="text-red-500 text-sm">{errors.user_id}</p>}
            </div>
            <div>
              <Label htmlFor="saving_plan_id">Savings Plan</Label>
              <Select
                value={data.saving_plan_id}
                onValueChange={(value) => setData('saving_plan_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map(plan => (
                    <SelectItem key={plan.id} value={plan.id.toString()}>
                      {plan.name} (₦{plan.daily_amount}/day)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.saving_plan_id && <p className="text-red-500 text-sm">{errors.saving_plan_id}</p>}
            </div>
            <div>
              <Label htmlFor="name">Saving Name</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                placeholder="Enter saving name"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={data.start_date}
                onChange={(e) => setData('start_date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.start_date && <p className="text-red-500 text-sm">{errors.start_date}</p>}
            </div>
            <div>
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={data.end_date}
                onChange={(e) => setData('end_date', e.target.value)}
                min={data.start_date || new Date().toISOString().split('T')[0]}
              />
              {errors.end_date && <p className="text-red-500 text-sm">{errors.end_date}</p>}
            </div>
            <div>
              <Label htmlFor="amount_per_day">Amount Per Day (₦)</Label>
              <Input
                id="amount_per_day"
                type="number"
                value={data.amount_per_day}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
                placeholder="Select a plan to fill amount"
              />
              {errors.amount_per_day && <p className="text-red-500 text-sm">{errors.amount_per_day}</p>}
            </div>
            <div>
              <Label htmlFor="targeted_amount">Targeted Amount (₦)</Label>
              <Input
                id="targeted_amount"
                type="number"
                value={data.targeted_amount}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
                placeholder="Select dates to calculate"
              />
              {errors.targeted_amount && <p className="text-red-500 text-sm">{errors.targeted_amount}</p>}
            </div>
            <div>
              <Label htmlFor="type">Contribution Type</Label>
              <Select
                value={data.type}
                onValueChange={(value) => setData('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="automatic">Automatic</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={processing}>
                {processing ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Saving Modal */}
      {selectedSaving && (
        <Dialog open={!!selectedSaving} onOpenChange={handleCloseViewModal}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedSaving.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Transaction ID</Label>
                  <p>{selectedSaving.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">User</Label>
                  <p>{selectedSaving.user?.name || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Savings Plan</Label>
                  <p>{selectedSaving.savingPlan?.name || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Start Date</Label>
                  <p>{formatDate(selectedSaving.start_date)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">End Date</Label>
                  <p>{formatDate(selectedSaving.end_date)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Amount Per Day</Label>
                  <p>₦{selectedSaving.amount_per_day.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Target Amount</Label>
                  <p>₦{selectedSaving.targeted_amount.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Contribution Type</Label>
                  <p>{selectedSaving.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <StatusBadge status={selectedSaving.status} />
                </div>
                <div>
                  <Label className="text-sm font-medium">Created At</Label>
                  <p>{formatDate(selectedSaving.created_at)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Approved By</Label>
                  <p>{selectedSaving.approvedBy?.name || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Approved On</Label>
                  <p>{selectedSaving.approved_on ? formatDate(selectedSaving.approved_on) : 'N/A'}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Daily Savings</h3>
                <DataTable
                  data={dailySavingsDetails}
                  columns={dailySavingsColumns}
                  sortableColumns={["id", "date", "amount", "type", "created_at"]}
                  globalFilter={["date", "type"]}
                  emptyInfo={
                    <div className="text-center py-4">
                      <p className="text-[#717680]">No daily savings records available.</p>
                    </div>
                  }
                />
              </div>
            </div>
            <DialogFooter>
              {selectedSaving.status !== 'started' && (
                <Button onClick={() => handleApprove(selectedSaving.id)} disabled={processing}>
                  {processing ? 'Approving...' : 'Approve'}
                </Button>
              )}
              <Button onClick={() => handleCancel(selectedSaving.id)} disabled={processing} variant="destructive">
                {processing ? 'Cancelling...' : 'Cancel Saving'}
              </Button>
              <Button variant="outline" onClick={handleCloseViewModal}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AppLayout>
  );
};

export default Index;
