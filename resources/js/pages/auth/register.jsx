import { Head, useForm,usePage } from '@inertiajs/react';
import { useState, useRef,useEffect } from 'react';
import AuthLayout from '@/layouts/auth-layout';
import { Button } from '@/components/ui/button';
import TextLink from '@/components/text-link';
import StepOne from './registerComponents/StepOne';
import StepTwo from './registerComponents/StepTwo';
import StepThree from './registerComponents/StepThree';
import StepFour from './registerComponents/StepFour';
import ProgressIndicator from './registerComponents/ProgressIndicator';
import AuthCarousel from './registerComponents/AuthCarousel';
import { Eye, EyeOff } from 'lucide-react';
import googleIcon from '@/components/images/Gmail_icon_(2020) 1.jpg';
import outlookIcon from '@/components/images/outlook-icon.jpg';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PasswordInput from '@/components/PasswordInput';
import { Checkbox } from '@/components/ui/checkbox';
import ConfirmPasswordInput from '@/components/ConfirmPasswordInput';


export default function Register({ ref }) {
  const avatarRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [step, setStep] = useState(1);

  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
     countryCode: '+234',
    ref_id: ref || '',
  });
const [refFromUrl, setRefFromUrl] = useState(false);
const page = usePage();

useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const refParam = urlParams.get('ref');

  if (refParam) {
    setData('ref_id', refParam);
    setRefFromUrl(true);
  }
}, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setData('avatar', file);
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const submit = (e) => {
    e.preventDefault();
    post(route('register'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  const steps = {
    1: <StepOne data={data} setData={setData} errors={errors} disabled={processing} />,
    2: <StepTwo data={data} setData={setData} errors={errors} disabled={processing} />,
    3: (
      <StepThree
        data={data}
        setData={setData}
        errors={errors}
        disabled={processing}
        handleAvatarChange={handleAvatarChange}
        avatarPreview={avatarPreview}
        avatarRef={avatarRef}
      />
    ),
    4: <StepFour data={data} setData={setData} errors={errors} disabled={processing} />,
  };
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


  return (
   <>
      <Head title="Register" />
    <AuthLayout>


        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-16 max-w-xl mx-auto">
          <h2 className="text-3xl font-bold mb-2 text-center">Sign up</h2>
          <p className="text-muted-foreground mb-6">
            Empower your experience, sign up for a free account today
          </p>

    

          <form onSubmit={submit} className="space-y-6">
          

            <div className="flex justify-between mt-4 flex-col gap-4">
            
            <div>
        <Label htmlFor="name">Full Name *</Label>
        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)}  />
        <InputError message={errors.name} />
      </div>
<div>
        <Label htmlFor="email">Email *</Label>
        <Input id="email" value={data.email} onChange={(e) => setData('email', e.target.value)}  />
        <InputError message={errors.email} />
      </div>

               <div>
  <Label htmlFor="phone">Phone number*</Label>
  <div className="flex  border py-2 rounded-lg shadow">
    <select
      className=" rounded-md px-2 text-sm w-[80px] focus:ring-0 focus:outline-0  focus:shadow-none"
      value={data.countryCode}
      onChange={(e) => setData('countryCode', e.target.value)}
    >
      {countryCodes.map((country) => (
        <option key={country.code} value={country.dial_code}>
          {country.dial_code}
        </option>
      ))}
    </select>
    <input
    className='border-0 border-l-2 pl-2   rounded-none shadow-none focus:ring-0 focus:outline-0  focus:shadow-none'
      id="phone"
      type="tel"
      placeholder="Enter phone number"
      value={data.phone}
      onChange={(e) => setData('phone', e.target.value)}
      required
    />
  </div>
  <InputError message={errors.phone} />
</div>

          <div>
           <PasswordInput data={data} setData={setData} errors={errors} />
          </div>
          <div>
           <ConfirmPasswordInput data={data} setData={setData} errors={errors} />
          </div>


          <div>
  <Label htmlFor="ref_id">Referral Code</Label>
  <Input
    id="ref_id"
    placeholder="Enter referral code"
    value={data.ref_id}
    onChange={(e) => setData('ref_id', e.target.value)}
    disabled={refFromUrl}
  />
  <InputError message={errors.ref_id} />
</div> 

          <div className='flex gap-2'>
             <Checkbox
             className='rounded-full h-5 w-5'
                            id="agree"
                            name="agree"
                            checked={data.agree}
                            onClick={() => setData('agree', !data.agree)}
                            tabIndex={3}
                        />
            <p className='text-[#414143] font-rubik font-light flex-1 text-[14px]'>Please exclude me from any future emails regarding Triosale and related Intuit product and feature updates, marketing best practices, and promotions.</p>
          </div>
              <Button type="submit" disabled={processing} className='bg-[#553AD5] w-full'>
               Get Started Free
              </Button>
            </div>
          </form>

          <div className="mt-6 text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <TextLink href={route('login')}>
              Login
            </TextLink>
          </div>
        </div>
 
    </AuthLayout>
    </>
  );
}
