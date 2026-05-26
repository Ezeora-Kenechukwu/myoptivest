import React from 'react';
import AppLayout from '@/Layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Create = () => {
  const { categories } = usePage().props;
  const { data, setData, post, errors } = useForm({
    category_id: '',
    name: '',
    description: '',
    min_price: '',
    max_price: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('admin.assets.store'));
  };

  return (
    <AppLayout>
      <Head title="Create Asset" />
      <div className="p-4  w-full sm:w-[400px] md:w-[600px] mx-auto">
        <h1 className="text-2xl font-bold mb-4">Create Asset</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="category_id">Category</Label>
            <Select onValueChange={value => setData('category_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id}</p>}
          </div>
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
          <div>
            <Label htmlFor="min_price">Min Price</Label>
            <Input id="min_price" type="number" value={data.min_price} onChange={e => setData('min_price', e.target.value)} />
            {errors.min_price && <p className="text-red-500 text-sm">{errors.min_price}</p>}
          </div>
          <div>
            <Label htmlFor="max_price">Max Price</Label>
            <Input id="max_price" type="number" value={data.max_price} onChange={e => setData('max_price', e.target.value)} />
            {errors.max_price && <p className="text-red-500 text-sm">{errors.max_price}</p>}
          </div>
          <Button type="submit">Create</Button>
        </form>
      </div>
    </AppLayout>
  );
};

export default Create;
