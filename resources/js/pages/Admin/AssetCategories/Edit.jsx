import React from 'react';
import AppLayout from '@/Layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const Edit = () => {
  const { category } = usePage().props;
  const { data, setData, put, errors } = useForm({
    name: category.name,
    description: category.description || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route('admin.asset-categories.update', category.id));
  };

  return (
    <AppLayout>
      <Head title="Edit Asset Type" />
      <div className="p-4 w-full sm:w-[400px] md:w-[600px] mx-auto">
        <h1 className="text-2xl font-bold mb-4">Edit Asset Type</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={data.name} onChange={e => setData('name', e.target.value)} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={data.description} onChange={e => setData('description', e.target.value)} />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>
          <Button type="submit">Update</Button>
        </form>
      </div>
    </AppLayout>
  );
};

export default Edit;
