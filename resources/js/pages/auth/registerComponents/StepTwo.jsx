import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export default function StepTwo({ data, setData, errors, disabled, handleAvatarChange, avatarPreview, avatarRef }) {
  return (
    <div className="grid gap-4">

  <h1 className="text-[#0A0A0C] font-rubik font-semibold text-[24px] leading-[100%] tracking-[1%] my-4 max-w-lg">
    Personal Profile
  </h1>

  <h2 className="text-[#101928] text-md font-rubik font-medium max-w-lg">
    Let’s personalize your experience. Update your details to get recommendations tailored to your goals and interests.
  </h2>

     <article className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
         <div>

        <Label>Username *</Label>
        <Input value={data.username} onChange={(e) => setData('username', e.target.value)}  />
        <InputError message={errors.username} />
      </div>
      <div>
        <Label>Gender *</Label>
        <Select value={data.gender} onValueChange={(value) => setData('gender', value)} >
          <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <InputError message={errors.gender} />
      </div>
     </article>
     <article className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div>
        <Label htmlFor="dob">Date of Birth *</Label>
        <Input id="dob" type="date" value={data.date_of_birth} onChange={(e) => setData('date_of_birth', e.target.value)} disabled={disabled} />
        <InputError message={errors.date_of_birth} />
      </div>
         <div>

        <Label>Country *</Label>
        <Input value={data.country} onChange={(e) => setData('country', e.target.value)} disabled={disabled} />
        <InputError message={errors.country} />
      </div>

     </article>
      <article className='grid grid-cols-1 sm:grid-cols-2 gap-4'>

      <div>
        <Label htmlFor="city">City</Label>
        <Input id="city" value={data.city} onChange={(e) => setData('city', e.target.value)} disabled={disabled} />
        <InputError message={errors.city} />
      </div>
      <div>
        <Label htmlFor="zip_code">Zip Code</Label>
        <Input id="zip_code" value={data.zip_code} onChange={(e) => setData('zip_code', e.target.value)} disabled={disabled} />
        <InputError message={errors.zip_code} />
      </div>
      </article>
      <article className='grid grid-cols-1 sm:grid-cols-2 gap-4'>

       <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={data.address} onChange={(e) => setData('address', e.target.value)} disabled={disabled} />
              <InputError message={errors.address} />
            </div>
      <div>
              <Label htmlFor="avatar">Avatar (jpg/png)</Label>
              <Input id="avatar" type="file" ref={avatarRef} accept="image/*" onChange={handleAvatarChange} disabled={disabled} />
              {avatarPreview && <img src={avatarPreview} alt="Avatar preview" className="mt-2 h-24 w-24 rounded-full object-cover" />}
              <InputError message={errors.avatar} />
            </div>

      </article>
    </div>
  );
}
