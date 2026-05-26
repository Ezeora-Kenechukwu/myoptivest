import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SearcheableSelectInput from "@/components/SearcheableSelectInput";
export default function StepThree({ data, setData, errors, disabled, handleAvatarChange, avatarPreview, avatarRef,banks }) {
  return (
    <div className="grid gap-4">
        <h1 className="text-[#0A0A0C] font-rubik font-semibold text-[24px] leading-[100%] tracking-[1%] my-4 max-w-lg">
  Add Your Bank Account Details
</h1>

<h2 className="text-[#101928] text-md font-rubik font-medium max-w-lg">
  Provide the bank account you’d like us to send your withdrawals to. Make sure the details are accurate to avoid delays.
</h2>
  <article className='grid grid-cols-1 sm:grid-cols-2 gap-4'>


       <div>
        <Label htmlFor="account_number">Account Number</Label>
        <Input id="account_number" value={data.account_number} onChange={(e) => setData('account_number', e.target.value)} disabled={disabled} />
        <InputError message={errors.account_number} />
      </div>
      <div>
        <Label htmlFor="account_name">Account Name</Label>
        <Input id="account_name" value={data.account_name} onChange={(e) => setData('account_name', e.target.value)} disabled={disabled} />
        <InputError message={errors.account_name} />
      </div>
      </article>
<div>
        <Label htmlFor="bank">Bank Name</Label>
         <SearcheableSelectInput
            options={banks}
            defaultValue={data.bank}
            onChange={(val) => setData("bank", val[0])}
          />
        <InputError message={errors.bank} />
      </div>

    </div>
  );
}
