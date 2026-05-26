import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import googleIcon from '@/components/images/Gmail_icon_(2020) 1.jpg';
import outlookIcon from '@/components/images/outlook-icon.jpg';

export default function Login({ status }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    phone: '',
    countryCode: '+234', // default value
    password: '',
  });

  const countryCodes = [
  { code: 'IN', dial_code: '+91' },
  { code: 'US', dial_code: '+1' },
  { code: 'GB', dial_code: '+44' },
  { code: 'NG', dial_code: '+234' },
  { code: 'GH', dial_code: '+233' },
  { code: 'KE', dial_code: '+254' },
  { code: 'ZA', dial_code: '+27' },
  // Add more as needed
];
  const [showPassword, setShowPassword] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <AuthLayout title="Login" description="Empower your experience, sign up for a free account today">
      <Head title="Log in" />

      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-16 max-w-xl mx-auto">
      <h2 className="text-3xl font-bold mb-2 text-center">Login</h2>
        <form className="max-w-sm w-full mx-auto flex flex-col gap-6" onSubmit={submit}>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="email">Email*</Label>
            <Input
              id="email"
              type="email"
              placeholder="ex. email@domain.com"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              required
            />
            <InputError message={errors.email} />
          </div>

         
  {/* 
   <div>
  <Label htmlFor="phone">Phone number*</Label>
  <div className="flex gap-2">
    <select
      className="border rounded-md p-2 text-sm w-[80px]"
      value={data.countryCode}
      onChange={(e) => setData('countryCode', e.target.value)}
    >
      {countryCodes.map((country) => (
        <option key={country.code} value={country.dial_code}>
          {country.dial_code}
        </option>
      ))}
    </select>
    <Input
      id="phone"
      type="tel"
      placeholder="Enter phone number"
      value={data.phone}
      onChange={(e) => setData('phone', e.target.value)}
      required
    />
  </div>
  <InputError message={errors.phone} />
</div> */}

          <div>
            <Label htmlFor="password">Password*</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={data.password}
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
          </div>

          <Button type="submit" className="w-full mt-2 bg-[#553AD5]" disabled={processing}>
            {processing ? 'Logging in...' : 'Login'}
          </Button>

          <div className="text-center text-sm mt-2">
            Don’t have an account?{' '}
            <a href={route('register')} className="text-primary font-medium">Register</a>
          </div>
        </div>
      </form>

      {/* Social login buttons */}
      <div className="mt-6 flex items-center justify-center gap-6">
        <a href="#" className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <img src={googleIcon} alt="Gmail" className="h-5 w-5" />
          Use Gmail
        </a>
        <a href="#" className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <img src={outlookIcon} alt="Outlook" className="h-5 w-5" />
          use Outlook
        </a>
      </div>

      {status && (
        <div className="mt-4 text-center text-sm font-medium text-green-600">{status}</div>
      )}
      </div>
    </AuthLayout>
  );
}
