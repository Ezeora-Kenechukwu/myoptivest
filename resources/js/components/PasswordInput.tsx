import { useState } from 'react';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input'; // or wherever your Input is from
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';// update path if needed

const PasswordInput = ({ data, setData, errors }: any) => {
  const [showPassword, setShowPassword] = useState(false);

  const rules = [
    { label: 'One number', test: /\d/ },
    { label: 'One lowercase character', test: /[a-z]/ },
    { label: 'One uppercase character', test: /[A-Z]/ },
    { label: '8 characters minimum', test: /.{8,}/ },
    { label: 'One special character', test: /[^A-Za-z0-9]/ },
  ];

  const password = data.password || '';

  return (
    <div>
      <Label htmlFor="password">Password*</Label>
      <div className="relative">
        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter password"
          value={password}
          onChange={(e) => setData('password', e.target.value)}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-2.5 text-muted-foreground"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      <InputError message={errors.password} />

      {/* Password Validation Grid */}
      <div className="grid grid-cols-2 gap-2 mt-3">
        {rules.map((rule, index) => {
          const isValid = rule.test.test(password);
          return (
            <p
              key={index}
              className="flex items-center gap-2 px-3 py-2 rounded"
              style={{
                // background: '#0A0A0C57',
                color: isValid ? '#4E41DA' : '#0A0A0C57',
                fontFamily: 'Outfit',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '100%',
                letterSpacing: '0%',
              }}
            >
              <IoIosCheckmarkCircle
                className="shrink-0"
                color={isValid ? '#4E41DA' : '#0A0A0C57'}
                size={18}
              />
              {rule.label}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordInput;
