// resources/js/Pages/Admin/Positions/PendingSells.jsx (updated with SweetAlert)
import React, { useState } from 'react';
import AppLayout from '@/Layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import StatusBadge from '@/Components/StatusBadge';
import { Button } from '@/components/ui/button';
import DropdownComponent from '@/Components/DropdownComponent';
import SweetAlert from '@/components/SweetAlert';
import { FaEye } from 'react-icons/fa';

const positionColumns = [
  { name: 'ID', selector: row => row.id, sortable: true },
  { name: 'User', selector: row => row.user_name, sortable: true },
  { name: 'Asset', selector: row => row.asset_name, sortable: true },
  { name: 'Units', selector: row => row.units, sortable: true },
  { name: 'Requested Price', selector: row => row.requested_price, sortable: true },
  { name: 'Status', selector: row => row.status, sortable: true },
  { name: 'Actions', selector: row => row.actions, sortable: false },
];

const PendingSells = ({ pending }) => {
  const { flash } = usePage().props;
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedPositionForApprove, setSelectedPositionForApprove] = useState(null);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [selectedPositionForDecline, setSelectedPositionForDecline] = useState(null);

  const { post: postApprove } = useForm({});
  const { post: postDecline } = useForm({});

  const handleShowApprove = (positionId) => {
    setSelectedPositionForApprove(positionId);
    setShowApproveModal(true);
  };

  const handleApprove = () => {
    if (selectedPositionForApprove) {
      postApprove(route('admin.positions.approve-sell', selectedPositionForApprove), {
        preserveScroll: true,
        onSuccess: () => {
          setShowApproveModal(false);
          setSelectedPositionForApprove(null);
        },
      });
    }
  };

  const handleShowDecline = (positionId) => {
    setSelectedPositionForDecline(positionId);
    setShowDeclineModal(true);
  };

  const handleDecline = () => {
    if (selectedPositionForDecline) {
      postDecline(route('admin.positions.decline-sell', selectedPositionForDecline), {
        preserveScroll: true,
        onSuccess: () => {
          setShowDeclineModal(false);
          setSelectedPositionForDecline(null);
        },
      });
    }
  };

  const pendingDetails = pending.data.map(position => ({
    id: position.id,
    user_name: position.user?.name || 'N/A',
    asset_name: position.asset?.name || 'N/A',
    units: position.units.toFixed(4),
    requested_price: `$${position.sell_requested_price}`,
    status: <StatusBadge status={position.status} />,
    actions: (
      <DropdownComponent buttonText={<FaEye className="h-5 w-5 text-primary" />} buttonClass="p-0">
        <button
          onClick={() => handleShowApprove(position.id)}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 w-full text-left px-4 py-2"
        >
          <span className="text-green-500">✓</span> Approve
        </button>
        <button
          onClick={() => handleShowDecline(position.id)}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 w-full text-left px-4 py-2"
        >
          <span className="text-red-500">✗</span> Decline
        </button>
        <a
          href={route('user.positions.show', position.id)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 w-full text-left px-4 py-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaEye /> View Details
        </a>
      </DropdownComponent>
    ),
  }));

  return (
    <AppLayout>
      <Head title="Pending Sells" />
      <div className="p-4 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-medium text-gray-900">Pending Sell Requests</h1>
            <p className="text-gray-600">Total: {pending.total} requests</p>
          </div>
        </div>

        <DataTable
          data={pendingDetails}
          columns={positionColumns}
          className="bg-white rounded-lg shadow"
          striped
          responsive
          pagination={pending}
        />
      </div>

      {/* Approve Confirmation */}
      {showApproveModal && (
        <SweetAlert
          confirm={true}
          message={`Approve sell request for ${pending.data.find(p => p.id === selectedPositionForApprove)?.asset_name || 'this asset'}?`}
          action={handleApprove}
          cancel={() => setShowApproveModal(false)}
        />
      )}

      {/* Decline Confirmation */}
      {showDeclineModal && (
        <SweetAlert
          confirm={true}
          message={`Decline sell request for ${pending.data.find(p => p.id === selectedPositionForDecline)?.asset_name || 'this asset'}?`}
          action={handleDecline}
          cancel={() => setShowDeclineModal(false)}
        />
      )}
    </AppLayout>
  );
};

export default PendingSells;
