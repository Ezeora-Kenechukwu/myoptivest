import React, { useState } from 'react'
import { Head, useForm } from "@inertiajs/react";

import InputLabel from "@/components/InputLabel";
import TextInput from "@/components/TextInput";
import InputError from "@/components/InputError";
import TextArea from "@/components/TextArea";
import PrimaryButton from "@/components/PrimaryButton";
import FileUpload from "@/components/FileUpload";
// components\SearcheableSelectInput.jsx
import SearcheableSelectInput from "@/components/SearcheableSelectInput";
import MyRichTextEditor from "@/components/MyRichTextEditor";
import { usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { FcMoneyTransfer } from "react-icons/fc";
import { FaCcMastercard } from "react-icons/fa";
import { IoCopy } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6"; // or any other 'copied' icon
// import SweetAlert from "@/components/SweetAlert";
import axios from 'axios'
const BankTransfer = ({errors, data, setData,processing }) => {
    const [alert, setAlert] = useState(null);
const handleConfirmTransfer = async () => {
      setData('loading', true)
  try {
    const res = await axios.post('/monnify/confirm-transfer', {
        transactionReference: data.transactionReference

    }

    );

    const status = res?.data?.status;
console.log('====================================');
console.log(res.data);
console.log('====================================');
    switch (status) {
      case 'PAID':
        setData('alert',{
          success: true,
          message: 'Your payment was successful. Your wallet will be credited shortly.',
        });
        break;
      case 'PENDING':
        setData('alert',{
          warning: true,
          message: 'Payment is still pending. Please wait a few minutes and check again.',
        });
        break;
      case 'OVERPAID':
        setData('alert',{
          info: true,
          message: 'You have paid more than required. Please contact support.',
        });
        break;
      case 'PARTIALLY_PAID':
        setData('alert',{
          warning: true,
          message: 'Payment is partially complete. Kindly complete the payment.',
        });
        break;
      case 'EXPIRED':
        setData('alert',{
          error: true,
          message: 'Transaction expired. Please start a new transfer.',
        });
        break;
      case 'FAILED':
        setData('alert',{
          error: true,
          message: 'Transaction failed. Please try again.',
        });
        break;
      case 'CANCELLED':
        setData('alert',{
          info: true,
          message: 'Transaction was cancelled. No payment was made.',
        });
        break;
      default:
        setData('alert',{
          info: true,
          message: `Transaction status is ${status}.`,
        });
    }
  } catch (error) {
    console.error(error);
    setData('alert',{
      error: true,
      message: 'Something went wrong while confirming your payment.',
    });
  } finally{
      setData('loading', false)
  }
};

     const [copied, setCopied] = useState(false);
      const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // revert icon after 2s
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  return (
    <div className='max-w-[511px] mx-auto'>
        <h1 className="font-rubik text-[#23272E] text-[32px] font-medium text-center ">Bank Transfer Details</h1>

            <div className='my-2'>
          <p className='text-md text-center font-rubik font-normal text-[#606060]'>Bank Name</p>
          <p className='text-2xl text-center font-rubik font-medium text-[#23272E]'>{data?.bankName}</p>
        </div>
            <div className='my-2'>
          <p className='text-md text-center font-rubik font-normal text-[#606060]'>Account Number</p>
         <div className='flex gap-4 items-center justify-center'>
             <p className='text-2xl text-center font-rubik font-medium text-[#23272E]'>{data?.accountNumber}</p>
             <button
      onClick={handleCopy}
      className="text-[#5042DA] cursor-pointer transition-all duration-200"
    >
      {copied ? <FaCheck /> : <IoCopy />}
    </button>
         </div>
        </div>
            <div className='my-2'>
          <p className='text-md text-center font-rubik font-normal text-[#606060]'>Account Name</p>
          <p className='text-2xl text-center font-rubik font-medium text-[#23272E]'>{data?.accountName}</p>
        </div>
        <button onClick={handleConfirmTransfer} className='border border-[#5042DA] px-[24px] py-[16px] rounded-[100px] h-[56pxpx] w-full bg-[#5042DA] text-white text-[16px] font-rubik font-[600]'>
                    Click here after making payments
                </button>


    </div>
  )
}

export default BankTransfer
