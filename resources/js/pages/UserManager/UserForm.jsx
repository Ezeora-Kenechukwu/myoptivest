import React from 'react'
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';
import InputError from '@/components/input-error';
import Modal from '@/components/Modal';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';


const UserForm = ({submit, data, setData, show, onClose, processing, errors}) => {
    const [avatarPreview, setAvatarPreview] = useState(null);
    const avatarRef = useRef(null);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setData('avatar', file);
            const reader = new FileReader();
            reader.onload = () => setAvatarPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

  return (
    <Modal show={show} onClose={onClose} >
        <form className="flex flex-col gap-6 py-5 overflow-y-auto px-5 max-h-[500px]" onSubmit={submit} encType="multipart/form-data">
                       <div className="grid gap-6">
       
                           {/* Name */}
                           <div className="grid gap-2">
                               <Label htmlFor="name">Name *</Label>
                               <Input
                                   id="name"
                                   type="text"
                                   required
                                   value={data.name}
                                   onChange={(e) => setData('name', e.target.value)}
                                   disabled={processing}
                                   placeholder="Full name"
                               />
                               <InputError message={errors.name} />
                           </div>
                           <div className="grid gap-2">
                               <Label htmlFor="username">Username *</Label>
                               <Input
                                   id="username"
                                   type="text"
                                   required
                                   value={data.username}
                                   onChange={(e) => setData('username', e.target.value)}
                                   disabled={processing}
                                   placeholder="Username"
                               />
                               <InputError message={errors.username} />
                           </div>
       
                           {/* Email */}
                           <div className="grid gap-2">
                               <Label htmlFor="email">Email Address *</Label>
                               <Input
                                   id="email"
                                   type="email"
                                   required
                                   value={data.email}
                                   onChange={(e) => setData('email', e.target.value)}
                                   disabled={processing}
                                   placeholder="you@example.com"
                               />
                               <InputError message={errors.email} />
                           </div>
       
                           {/* Phone */}
                           <div className="grid gap-2">
                               <Label htmlFor="phone">Phone Number *</Label>
                               <Input
                                   id="phone"
                                   type="tel"
                                   required
                                   value={data.phone}
                                   onChange={(e) => setData('phone', e.target.value)}
                                   disabled={processing}
                               />
                               <InputError message={errors.phone} />
                           </div>
       
                           {/* Country */}
                           <div className="grid gap-2">
                               <Label>Country *</Label>
                               <Input
                                   id="country"
                                   type="text"
                                   required
                                   value={data.country}
                                   onChange={(e) => setData('country', e.target.value)}
                                   disabled={processing}
                               />
                             
                               <InputError message={errors.country} />
                           </div>
       
                           {/* Gender */}
                           <div className="grid gap-2">
                               <Label>Gender *</Label>
                               <Select
                                   value={data.gender}
                                   onValueChange={(value) => setData('gender', value)}
                                   disabled={processing}
                               >
                                   <SelectTrigger>
                                       <SelectValue placeholder="Select gender" />
                                   </SelectTrigger>
                                   <SelectContent>
                                       <SelectItem value="male">Male</SelectItem>
                                       <SelectItem value="female">Female</SelectItem>
                                       <SelectItem value="other">Other</SelectItem>
                                   </SelectContent>
                               </Select>
                               <InputError message={errors.gender} />
                           </div>
       
                           {/* Date of Birth */}
                           <div className="grid gap-2">
                               <Label htmlFor="dob">Date of Birth *</Label>
                               <Input
                                   id="dob"
                                   type="date"
                                   required
                                   value={data.date_of_birth}
                                   onChange={(e) => setData('date_of_birth', e.target.value)}
                                   disabled={processing}
                               />
                               <InputError message={errors.date_of_birth} />
                           </div>
       
                           {/* City */}
                           <div className="grid gap-2">
                               <Label htmlFor="city">City (optional)</Label>
                               <Input
                                   id="city"
                                   value={data.city}
                                   onChange={(e) => setData('city', e.target.value)}
                                   disabled={processing}
                               />
                               <InputError message={errors.city} />
                           </div>
       
                           {/* Zip Code */}
                           <div className="grid gap-2">
                               <Label htmlFor="zip_code">ZIP Code (optional)</Label>
                               <Input
                                   id="zip_code"
                                   value={data.zip_code}
                                   onChange={(e) => setData('zip_code', e.target.value)}
                                   disabled={processing}
                               />
                               <InputError message={errors.zip_code} />
                           </div>
       
                           {/* Address */}
                           <div className="grid gap-2">
                               <Label htmlFor="address">Address (optional)</Label>
                               <Input
                                   id="address"
                                   value={data.address}
                                   onChange={(e) => setData('address', e.target.value)}
                                   disabled={processing}
                               />
                               <InputError message={errors.address} />
                           </div>
       
                           {/* Ref ID */}
                           <div className="grid gap-2">
                               <Label htmlFor="ref_id">Referrer ID (optional)</Label>
                               <Input
                                   id="ref_id"
                                   type="number"
                                   value={data.ref_id}
                                   onChange={(e) => setData('ref_id', e.target.value)}
                                   disabled={processing}
                               />
                               <InputError message={errors.ref_id} />
                           </div>
       
                           {/* Avatar */}
                           <div className="grid gap-2">
                               <Label htmlFor="avatar">Avatar (optional, jpg/png only)</Label>
                               <Input
                                   id="avatar"
                                   type="file"
                                   accept="image/*"
                                   ref={avatarRef}
                                   onChange={handleAvatarChange}
                                   disabled={processing}
                               />
                               {avatarPreview && (
                                   <img
                                       src={avatarPreview}
                                       alt="Avatar Preview"
                                       className="mt-2 h-24 w-24 rounded-full object-cover"
                                   />
                               )}
                               <InputError message={errors.avatar} />
                           </div>
       
                           {/* Password */}
                           <div className="grid gap-2">
                               <Label htmlFor="password">Password *</Label>
                               <Input
                                   id="password"
                                   type="password"
                                   required
                                   value={data.password}
                                   onChange={(e) => setData('password', e.target.value)}
                                   disabled={processing}
                               />
                               <InputError message={errors.password} />
                           </div>
       
                           {/* Password Confirmation */}
                           <div className="grid gap-2">
                               <Label htmlFor="password_confirmation">Confirm Password *</Label>
                               <Input
                                   id="password_confirmation"
                                   type="password"
                                   required
                                   value={data.password_confirmation}
                                   onChange={(e) => setData('password_confirmation', e.target.value)}
                                   disabled={processing}
                               />
                               <InputError message={errors.password_confirmation} />
                           </div>
       
                           <Button type="submit" className="w-full" disabled={processing}>
                               {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                               Create User
                           </Button>
                       </div>
       
                     
                   </form>
                </Modal>
  )
}

export default UserForm
