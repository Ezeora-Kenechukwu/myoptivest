import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';// 

interface Data {
    password:string;
    password_confirmation:string;
}
interface ConfirmPasswordInputProps {
  data:Data;
  setData: (field: string, value: string) => void;
}

const ConfirmPasswordInput = ({
data,
  setData,
}: ConfirmPasswordInputProps) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const confirmError =
    data.password_confirmation.length > 0 && data.password_confirmation !== data.password
      ? 'Passwords do not match'
      : '';

  return (
    <div className="mt-5">
      <Label htmlFor="password_confirmation">Confirm Password*</Label>
      <div className="relative">
        <Input
          id="password_confirmation"
          type={showConfirm ? 'text' : 'password'}
          placeholder="Re-enter password"
          value={data.password_confirmation}
          onChange={(e) => setData('password_confirmation', e.target.value)}
          required
        />
        <button
          type="button"
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute right-3 top-2.5 text-muted-foreground"
        >
          {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      <InputError message={confirmError} />
    </div>
  );
};

export default ConfirmPasswordInput;
