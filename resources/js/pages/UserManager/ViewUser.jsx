import React from 'react'
import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';
import InputError from '@/components/input-error';
import Modal from '@/components/Modal';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import formatDate from "@/utils/formatDate";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';


const ViewUser = ({submit, data, setData, show, onClose, processing, errors}) => {
    const {avatar,
name,
type,
country,
phone,
countryCode,
username,
email,
gender,
date_of_birth,
city,
zip_code,
address,
wallet,
refferal_code,
kyc,
referral_link,
roles,
referrer} = data.user
    const [avatarPreview, setAvatarPreview] = useState(null);
    const avatarRef = useRef(null);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setData('avatar', file);
            const reader = new FileReader();
            reader.onload = () => setAvatarPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

  return (
    <Modal show={show} onClose={onClose} maxWidth='5xl' >
       <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl  w-full p-8 transition-all duration-300 animate-fade-in max-h-[600px] overflow-y-auto">
         <div class="flex flex-col md:flex-row">
            <div class="md:w-1/3 text-center mb-8 md:mb-0">
                <img src={`/storage/${avatar}`} alt="Profile Picture" class="rounded-full w-48 h-48 mx-auto mb-4 border-4 border-indigo-800 dark:border-blue-900 transition-transform duration-300 hover:scale-105" />
                <h1 class="text-md font-bold text-indigo-800 dark:text-white mb-2 capitalize">&#x20a6;{wallet}</h1>
                <h1 class="text-md font-bold text-indigo-800 dark:text-white mb-2 capitalize">{name}</h1>
                <p class="text-gray-600 dark:text-gray-300 capitalize">{username}\{type}</p>
                <Link href={referral_link} class="mt-4 bg-indigo-800 block text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors duration-300">Referal Link</Link>
            </div>
            <div class="md:w-2/3 md:pl-8">
                <h2 class="text-xl font-semibold text-indigo-800 dark:text-white mb-4">KYC Validation</h2>
                <p class="text-gray-700 dark:text-gray-300 mb-6">
                   {kyc ? "KYC have been Submitted" : "Not Submitted"}
                </p>
                <h2 class="text-xl font-semibold text-indigo-800 dark:text-white mb-4">Location</h2>
                <p class="text-gray-700 dark:text-gray-300 mb-6">
                    City: {city}, Country: {country}, Zip code: {zip_code}
                </p>
                <h2 class="text-xl font-semibold text-indigo-800 dark:text-white mb-4">Gender</h2>
                <p class="text-gray-700 dark:text-gray-300 mb-6">
                    {gender}
                </p>
                <h2 class="text-xl font-semibold text-indigo-800 dark:text-white mb-4">Date of Birth</h2>
                <p class="text-gray-700 dark:text-gray-300 mb-6">
                    {formatDate(date_of_birth)}
                </p>
               
                <h2 class="text-xl font-semibold text-indigo-800 dark:text-white mb-4">Contact Information</h2>
                <ul class="space-y-2 text-gray-700 dark:text-gray-300">
                    <li class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-800 dark:text-blue-900" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                       {email}
                    </li>
                    <li class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-800 dark:text-blue-900" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      {countryCode} {phone}
                    </li>
                    <li class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-800 dark:text-blue-900" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                        </svg>
                        {address}
                    </li>
                </ul>
            </div>


       </div>
       </div>
                </Modal>
  )
}

export default ViewUser
