// @ts-nocheck
// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';
import { FaSignOutAlt } from 'react-icons/fa';

export default function VerifyEmail({auth:user, status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <AuthLayout title="Verify email" description="Please verify your email address by clicking on the link we just emailed to you.">
            <Head title="Email verification" />

           <div className='flex items-center justify-center flex-col gap-4 w-full h-screen bg-white '>
             {/* {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    A new verification link has been sent to the email address you provided during registration.
                </div>
            )} */}

            <form onSubmit={submit} className="space-y-6 px-4">
                <h1 className='font-rubik text-[32px] text-[#0A0A0C] font-semibold'>Check your email</h1>

                <div className='font-rubik text-[16px] text-[#0A0A0C] font-normal max-w-lg'>We’ve sent an email to  <strong className='font-rubik text-[16px] text-[#0A0A0C] font-semibold'>{user?.user?.email}</strong> with a link to activate your account</div>

                <div className="flex gap-6 items-center mt-6 mb-12">
                    <a
  href="https://mail.google.com/mail/u/0/#inbox" target='_blank'
  className="text-[#143DF2] font-rubik font-normal text-base leading-none underline underline-offset-0 decoration-solid decoration-[0px] flex gap-2 items-center"
>
    <img className="" src='/gmail.png' />
  Open Gmail
</a>

<a
  href="https://outlook.office.com/mail/" target='_blank'
  className="text-[#143DF2] font-rubik font-normal text-base leading-none underline underline-offset-0 decoration-solid decoration-[0px] flex gap-2 items-center"
>
     <img className="" src='/outlook.png' />
  Open Outlook
</a>

                </div>
                 <h1 className='font-rubik text-[20px] text-[#0A0A0C] font-semibold'>Didn’t get an email? Check your spam folder!</h1>

                 <button disabled={processing} className='text-[#4D43DB] font-rubik font-normal text-base leading-none underline underline-offset-0 decoration-solid decoration-[0px] flex gap-2 items-center cursor-pointer'>
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Resend verification email
                </button>

                <TextLink href={route('logout')} method="post" className=" flex text-[#b10505] font-rubik text-[16px] items-center gap-5 cursor-pointer">
                    <FaSignOutAlt size={30} />
                    Log out
                </TextLink>
            </form>
           </div>
        </AuthLayout>
    );
}
