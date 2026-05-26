import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Tabs  from '@/components/Tab';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { FaTable } from 'react-icons/fa6';
import PersonalDetailsForm from './Tabs/PersonalDetailsForm';
import PasswordForm from './Tabs/PasswordForm';



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

type ProfileForm = {
    name: string;
    email: string;
}

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: auth.user.name,
        email: auth.user.email,
    });
    const tabButton = [
        {
            id: 1,
            icon: <FaTable />,
            title: 'Personal Details',
            link: "#personaldetails"
        },
        {
            id: 2,
            icon: <FaTable />,
            title: 'Password',
            link: "#password"
        },
    ];

    const tabComponents = [
        {
            id: 1,
            linkId: 'personaldetails',
            component: <PersonalDetailsForm data={data} setData={setData} errors={errors} processing={processing} mustVerifyEmail={mustVerifyEmail} status={status} auth={auth} recentlySuccessful={recentlySuccessful} />
        },
        {
            id: 2,
            linkId: 'password',
            component: <PasswordForm  mustVerifyEmail={mustVerifyEmail}
            status={status}
            auth={auth}
            recentlySuccessful={recentlySuccessful} />
        },
    ]
    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Profile information" description="Update your name and email address" />


                    <Tabs tabButton={tabButton} tabComponents={tabComponents} color='blue' />
                </div>

                {/* <DeleteUser /> */}
            </SettingsLayout>
        </AppLayout>
    );
}
