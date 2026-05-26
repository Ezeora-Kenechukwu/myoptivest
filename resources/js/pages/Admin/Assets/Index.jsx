// resources/js/Pages/Admin/Assets/Index.jsx (updated with SweetAlert for delete)
import React from 'react';
import AppLayout from '@/Layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import { Button } from '@/components/ui/button';
import SweetAlert from '@/Components/SweetAlert';

const assetColumns = [
  { name: 'ID', selector: row => row.id, sortable: true },
  { name: 'Name', selector: row => row.name, sortable: true },
  { name: 'Category', selector: row => row.category, sortable: true },
  { name: 'Min Price', selector: row => row.min_price, sortable: true },
  { name: 'Max Price', selector: row => row.max_price, sortable: true },
  { name: 'Current Price', selector: row => row.current_price, sortable: true },
  { name: 'Actions', selector: row => row.actions, sortable: false },
];

const AssetsIndex = ({ assets }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState(null);

  const handleDelete = (id, name) => {
    setSelectedAssetId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedAssetId) {
      router.delete(route('admin.assets.destroy', selectedAssetId));
      setShowDeleteConfirm(false);
      setSelectedAssetId(null);
    }
  };

  const assetDetails = assets.data.map(asset => ({
    id: asset.id,
    name: asset.name,
    category: asset.category?.name || 'N/A',
    min_price: `$${asset.min_price}`,
    max_price: `$${asset.max_price}`,
    current_price: `$${asset.current_price}`,
    actions: (
      <div className="flex flex-col sm:flex-row gap-2">
        <Link href={route('admin.assets.edit', asset.id)}>
          <Button size="sm">Edit</Button>
        </Link>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => handleDelete(asset.id, asset.name)}
        >
          Delete
        </Button>
      </div>
    ),
  }));

  return (
    <AppLayout>
      <Head title="Assets" />
      <div className="p-4 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-medium text-gray-900">Assets</h1>
          <Link href={route('admin.assets.create')}>
            <Button>Create Asset</Button>
          </Link>
        </div>
        <DataTable
          data={assetDetails}
          columns={assetColumns}
          className="bg-white rounded-lg shadow"
          striped
          responsive
          pagination={assets}
        />
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <SweetAlert
          confirm={true}
          message={`Delete asset "${assets.data.find(a => a.id === selectedAssetId)?.name || 'this asset'}"? This action cannot be undone.`}
          action={confirmDelete}
          cancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </AppLayout>
  );
};

export default AssetsIndex;
