import { Head, useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';
import AuthLayout from '@/layouts/auth-layout';
import { Button } from '@/components/ui/button';
import TextLink from '@/components/text-link';
import StepOne from './registerComponents/StepOne';
import StepTwo from './registerComponents/StepTwo';
import StepThree from './registerComponents/StepThree';
import StepFour from './registerComponents/StepFour';
import ProgressIndicator from './registerComponents/ProgressIndicator';
import AuthCarousel from './registerComponents/AuthCarousel';
import MultiStepForm from '../../components/MultiStepForm';

// {
//     "id": 2,
//     "ranking_id": null,
//     "rankings": null,
//     "avatar": "avatar/s5D1lQbqxEXmwWuK3ioSvXHuKF5Q13vCq0Ba83RM.jpg",
//     "name": "Goodness Omembge Oji",
//     "type": "user",
//     "country": "Nigeria",
//     "phone": "07032286222",
//     "countryCode": "",
//     "username": "omembge",
//     "email": "good@gmail.com",
//     "gender": "female",
//     "date_of_birth": "2025-05-21",
//     "city": "Enugu",
//     "zip_code": "20009",
//     "address": "No 1 Otakpu Street",
//     "wallet": 0,
//     "savings_balance": 0,
//     "investment_balance": 0,
//     "withdrawable_savings_balance": 0,
//     "withdrawable_investment_balance": 0,
//     "investment_profit_balance": 0,
//     "status": true,
//     "refferal_code": null,
//     "kyc": false,
//     "kyc_credential": null,
//     "google2fa_secret": null,
//     "two_fa": false,
//     "deposit_status": true,
//     "withdraw_status": false,
//     "transfer_status": false,
//     "ref_id": null,
//     "email_verified_at": null,
//     "password": "$2y$12$mlczSVxaa6Hm196mEzCTfOX4DxcDc/WJk06cIOFXtgRC.iHGbFcce",
//     "remember_token": null,
//     "created_at": "2025-05-08T16:13:06.000000Z",
//     "updated_at": "2025-05-08T16:13:06.000000Z",
//     "referral_link": "http://127.0.0.1:8000/register?ref=",
//     "roles": [
//         {
//             "id": 3,
//             "name": "User",
//             "slug": "user",
//             "type": "user",
//             "description": "This is the base role for user",
//             "base_role": 1,
//             "parent_role_id": null,
//             "active": 1,
//             "deleted_at": null,
//             "created_at": "2025-04-21T03:03:16.000000Z",
//             "updated_at": "2025-04-21T03:03:16.000000Z",
//             "pivot": {
//                 "user_id": 2,
//                 "role_id": 3,
//                 "created_at": "2025-05-08T16:13:06.000000Z",
//                 "updated_at": "2025-05-08T16:13:06.000000Z"
//             }
//         }
//     ],
//     "referrer": null
// }


export default function Register({ ref, banks }) {
  const avatarRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [step, setStep] = useState(1);

  const { data, setData, post, processing, errors, reset } = useForm({
    username: '',
    country: '',
    gender: '',
    date_of_birth: '',
    city: '',
    zip_code: '',
    address: '',
    avatar: null,
    account_number:'',
    bank:'',
    account_name:'',
    reason:'',
    pin:'',
    pin_confirmation:'',
  });

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
    post(route('kyc'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  const steps = {
    1: <StepOne data={data} setData={setData} errors={errors} disabled={processing} />,
    2: <StepTwo data={data} setData={setData} errors={errors} disabled={processing} />,
    3: (
      <StepThree
      banks={banks}
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

  return (
   <>
      <Head title="Register" />
    <AuthLayout>

        <div className='w-full h-screen my-6'>
            <MultiStepForm steps={[
              { title: "Account Setup", content: <StepOne data={data} setData={setData} errors={errors} disabled={processing} /> },
              { title: "Personal Information", content: <StepTwo data={data} setData={setData} errors={errors} disabled={processing} handleAvatarChange={handleAvatarChange}
        avatarPreview={avatarPreview}
        avatarRef={avatarRef} /> },
              { title: "Account Details", content: <StepThree
      banks={banks}
        data={data}
        setData={setData}
        errors={errors}
        disabled={processing}
        handleAvatarChange={handleAvatarChange}
        avatarPreview={avatarPreview}
        avatarRef={avatarRef}
      /> },
              { title: "Pin Settings", content: <StepFour data={data} setData={setData} errors={errors} disabled={processing} /> },
            ]}
            submit={submit}
            />
        </div>

        {/* <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-16 max-w-xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">Sign up</h2>
          <p className="text-muted-foreground mb-6">
            Empower your experience, sign up for a free account today
          </p>

          <ProgressIndicator currentStep={step} totalSteps={4} />

          <form onSubmit={step === 4 ? submit : (e) => { e.preventDefault(); nextStep(); }} className="space-y-6">
            {steps[step]}

            <div className="flex justify-between mt-4">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Back
                </Button>
              )}
              <Button type="submit" disabled={processing} className='bg-[553AD5]'>
                {step === 4 ? 'Create Account' : 'Continue'}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <TextLink href={route('login')}>
              Login
            </TextLink>
          </div>
        </div> */}

    </AuthLayout>
    </>
  );
}
