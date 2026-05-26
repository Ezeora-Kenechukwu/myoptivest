// resources/js/Pages/Admin/AssetCategories/Index.jsx (updated with SweetAlert for delete)
import React from 'react';
import AppLayout from '@/Layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import { Button } from '@/components/ui/button';
import SweetAlert from '@/Components/SweetAlert';

const categoryColumns = [
  { name: 'ID', selector: row => row.id, sortable: true },
  { name: 'Name', selector: row => row.name, sortable: true },
  { name: 'Description', selector: row => row.description, sortable: true },
  { name: 'Actions', selector: row => row.actions, sortable: false },
];

const AssetCategoriesIndex = ({ categories }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const handleDelete = (id, name) => {
    setSelectedCategoryId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedCategoryId) {
      router.delete(route('admin.asset-categories.destroy', selectedCategoryId));
      setShowDeleteConfirm(false);
      setSelectedCategoryId(null);
    }
  };

  const categoryDetails = categories.data.map(category => ({
    id: category.id,
    name: category.name,
    description: category.description || 'N/A',
    actions: (
      <div className="flex flex-col sm:flex-row gap-2">
        <Link href={route('admin.asset-categories.edit', category.id)}>
          <Button size="sm">Edit</Button>
        </Link>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => handleDelete(category.id, category.name)}
        >
          Delete
        </Button>
      </div>
    ),
  }));

  return (
    <AppLayout>
      <Head title="Asset Categories" />
      <div className="p-4 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-medium text-gray-900">Asset Categories</h1>
          <Link href={route('admin.asset-categories.create')}>
            <Button>Create Category</Button>
          </Link>
        </div>
        <DataTable
          data={categoryDetails}
          columns={categoryColumns}
          className="bg-white rounded-lg shadow"
          striped
          responsive
          pagination={categories}
        />
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <SweetAlert
          confirm={true}
          message={`Delete category "${categories.data.find(c => c.id === selectedCategoryId)?.name || 'this category'}"? This will also delete all associated assets.`}
          action={confirmDelete}
          cancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </AppLayout>
  );
};

export default AssetCategoriesIndex;
