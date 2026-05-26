import React, { useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Transition } from '@headlessui/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

type PasswordFormProps = {
  mustVerifyEmail: boolean;
  status?: string;
  auth: any;
  recentlySuccessful: boolean;
};

const PasswordForm = ({ mustVerifyEmail, status, auth, recentlySuccessful }: PasswordFormProps) => {
  const passwordInput = useRef<HTMLInputElement>(null);
  const currentPasswordInput = useRef<HTMLInputElement>(null);

  const { data, setData, put, reset, errors, processing } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  const updatePassword = (e: React.FormEvent) => {
    e.preventDefault();

    put(route('password.update'), {
      preserveScroll: true,
      onSuccess: () => reset(),
      onError: (errors) => {
        if (errors.password) {
          reset('password', 'password_confirmation');
          passwordInput.current?.focus();
        }

        if (errors.current_password) {
          reset('current_password');
          currentPasswordInput.current?.focus();
        }
      },
    });
  };

  const handleCancel = () => {
    reset(); // clears all input fields
  };

  return (
    <form onSubmit={updatePassword} className="space-y-6" id="password">
      <div className="grid grid-cols-2 justify-evenly gap-4">
        {/* Current Password */}
        <div className="grid gap-2 relative">
          <Label htmlFor="current_password">Enter Old Password</Label>
          <section className="flex items-center">
            <Input
            id="current_password"
            ref={currentPasswordInput}
            value={data.current_password}
            onChange={(e) => setData('current_password', e.target.value)}
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Current password"
          />
          <div className="absolute right-3 cursor-pointer" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
          </section>
           <InputError message={errors.current_password} />
        </div>

        {/* New Password */}
        <div className="grid gap-2 relative">
          <Label htmlFor="password">Enter New Password</Label>
          <section className="flex items-center">
            <Input
            id="password"
            ref={passwordInput}
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="New password"
          />
          <div className="absolute right-3 cursor-pointer" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
                 </section>
          <InputError message={errors.password} />


        </div>

        {/* Confirm Password */}
        <div className="col-span-2 grid gap-2 relative">
          <Label htmlFor="password_confirmation">Confirm New Password</Label>
          <section className="flex items-center">
            <Input
            id="password_confirmation"
            value={data.password_confirmation}
            onChange={(e) => setData('password_confirmation', e.target.value)}
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Confirm password"
          />
          <div className="absolute right-3 cursor-pointer" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
          </section>
          <InputError message={errors.password_confirmation} />

        </div>
      </div>

      <div className="flex justify-center items-center gap-3">
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={processing} className='bg-[#5639D4]'>
            Update password
          </Button>

          <Transition
            show={recentlySuccessful}
            enter="transition ease-in-out"
            enterFrom="opacity-0"
            leave="transition ease-in-out"
            leaveTo="opacity-0"
          >
            <p className="text-sm text-neutral-600">Saved.</p>
          </Transition>
        </div>

        <button
          type="button"
          onClick={handleCancel}
          className="bg-white border-2 border-[#595959] px-6 py-2 rounded-md dark:text-black"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PasswordForm;
