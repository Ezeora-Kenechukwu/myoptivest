import React from 'react'
import { Head, useForm } from "@inertiajs/react";

import InputLabel from "@/components/InputLabel";
import TextInput from "@/components/TextInput";
import InputError from "@/components/InputError";
import TextArea from "@/components/TextArea";
import PrimaryButton from "@/components/PrimaryButton";
import FileUpload from "@/components/FileUpload";
import axios from 'axios'
// components\SearcheableSelectInput.jsx
import SearcheableSelectInput from "@/components/SearcheableSelectInput";
import MyRichTextEditor from "@/components/MyRichTextEditor";
import { usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { FcMoneyTransfer } from "react-icons/fc";
import { FaCcMastercard } from "react-icons/fa";
const FundWallet = ({errors, data, setData,processing }) => {
const handleFundWallet = async () => {
    setData('loading', true);

    if (!data.payment_method) {
        alert("Please select a payment method");
        setData('loading', false);
        return;
    }

    try {
        if (data.payment_method === "bank transfer") {
            const res = await axios.post('/monnify/init-transfer', {
                amount: data.amount,
                customer_name: data.customer_name,
                customer_email: data.customer_email,
                bank_code: '035'
            });

            const dat = res.data;

            if (dat.success && dat.data) {
                const account = dat.data.account || {};
                setData({
                    ...data,
                    transactionReference: dat.data.transactionReference,
                    paymentReference: dat.data.paymentReference,
                    accountNumber: account.accountNumber || '',
                    accountName: account.accountName || '',
                    bankName: account.bankName || '',
                    showTransfer: true,
                    showCardCharge: false,
                    showFund: false,
                });
            } else {
                alert("Transfer setup failed. Try again.");
            }
        }

        if (data.payment_method === "bank card") {
            const res = await axios.post('/monnify/init-card', {
                amount: data.amount,
                customer_name: data.customer_name,
                customer_email: data.customer_email,
            });

            const dat = res.data;

            if (dat.success && dat.data.checkoutUrl) {
                window.open(dat.data.checkoutUrl, '_blank');
                setData({
                    ...data,
                    transactionReference: dat.data.transactionReference,
                    paymentReference: dat.data.paymentReference,
                    showTransfer: false,
                    showCardCharge: false,
                    showFund: false,
                });
            } else {
                alert("Hosted card checkout failed. Please try again.");
            }
        }

        // ✅ Hosted Monnify Checkout flow
        if (data.payment_method === "monnify") {
            const res = await axios.post('/monnify/checkout/init', {
                amount: data.amount,
                customer_name: data.customer_name,
                customer_email: data.customer_email,
                callback_url: route('checkout-callback'), // Optional if your backend hardcodes this
            });

            const dat = res.data;

            if (dat.success && dat.data.checkoutUrl) {
                window.open(dat.data.checkoutUrl, '_blank');
            } else {
                alert("Monnify Checkout failed. Please try again.");
            }
        }

    } catch (error) {
        console.error(error);
        alert("An error occurred during payment initialization.");
    } finally {
        setData('loading', false);
    }
};


  return (
    <div className='max-w-[511px] mx-auto'>
        <h1 className="font-rubik text-[#23272E] text-[32px] font-medium text-center ">Fund Optivest Wallet</h1>
        <p className='font-rubik font-normal text-[18px] text-[#23272E]  text-center'>Select the best top up method</p>
          {/* Category */}
        <div className='my-2'>
          <InputLabel htmlFor="wallet_type" value="Wallet Type" />
          <SearcheableSelectInput
            options={[{name:"Optivest Wallet",  id:"Optivest Wallet"}]}
            defaultValue={data}
            onChange={(val) => setData("wallet_type", val[0])}
          />
          <InputError message={errors.wallet_type} className="mt-2" />
        </div>
 <div>
          <InputLabel htmlFor="amount" value="Top Up Amount" />
         <div className='flex border-1 rounded-[6px] p-[8px] items-center gap-[14px] h-[45px] border-[#D0D5DD] shadow-sm'>
            <p className='text-[#D0D5DD] text-[15px]'>&#x20A6;</p>
             <input id="name" value={data.amount} onChange={(e) => setData("amount", e.target.value)} className="focus:outline-0 focus:ring-0 flex-1 border-l-1 border-l-[#D0D5DD]h-full px-4" required />

         </div>
          <p className="font-rubik font-normal text-xs text-[#98A2B3]  ">Minimum: N10,000 | Maximum: N50,000</p>
          <InputError message={errors.amount} className="mt-2" />
        </div>

        <div className=' my-5 '>
            <h1 className='text-[#101928] text-lg font-rubik font-medium text-md  '>Payment Method</h1>

            <div className='flex flex-col gap-4 mt-5'>
            <label className={`flex items-center px-5 gap-6  h-[61px] rounded-[9px]   ${data.payment_method == 'monnify' ? 'border-[#4C44DB] border-2' : 'border-[#00000045] border-[0.3px] '}`} htmlFor='monnify'>
                <Checkbox checked={data.payment_method == 'monnify'} className='data-[state=checked]:bg-transparent data-[state=checked]:text-[#4C44DB] data-[state=checked]:border-[#4C44DB] checked:border-[#4C44DB] checked:text-[#4C44DB]'  id="monnify" value="monnify" name="payment_method" onClick={(e) =>  setData('payment_method', data.payment_method == "monnify" ? '': e.target.value)      } />
                    <img src='/monnifylogo.png' className='w-[105px] h-[18px]' />
                         </label>
            <label className={`flex items-center px-5 gap-6  h-[61px] rounded-[9px]   ${data.payment_method == 'bank transfer' ? 'border-[#4C44DB] border-2' : 'border-[#00000045] border-[0.3px] '}`} htmlFor='bank transfer'>
                <Checkbox checked={data.payment_method == 'bank transfer'} className='data-[state=checked]:bg-transparent data-[state=checked]:text-[#4C44DB] data-[state=checked]:border-[#4C44DB] checked:border-[#4C44DB] checked:text-[#4C44DB]'  id="bank transfer" value="bank transfer" name="payment_method" onClick={(e) =>  setData('payment_method', data.payment_method == "bank transfer" ? '': e.target.value)      } />

                    <p className={`flex items-center gap-2    ${data.payment_method == 'bank transfer' ? 'text-[#4C44DB]' : 'text-[#585858]  '}`}><FcMoneyTransfer size={30} /> Bank Transfer</p>
            </label>
            <label className={`flex items-center px-5 gap-6  h-[61px] rounded-[9px]   ${data.payment_method == 'bank card' ? 'border-[#4C44DB] border-2' : 'border-[#00000045] border-[0.3px] '}`} htmlFor='bank card'>
                <Checkbox checked={data.payment_method == 'bank card'} className='data-[state=checked]:bg-transparent data-[state=checked]:text-[#4C44DB] data-[state=checked]:border-[#4C44DB] checked:border-[#4C44DB] checked:text-[#4C44DB]'  id="bank card" value="bank card" name="payment_method" onClick={(e) =>  setData('payment_method', data.payment_method == "bank card" ? '': e.target.value)      } />

                    <p className={`flex items-center gap-2    ${data.payment_method == 'bank card' ? 'text-[#4C44DB]' : 'text-[#585858]  '}`}><FaCcMastercard size={30} /> Bank Card</p>
            </label>
            </div>

        </div>

        <button className='border border-[#5042DA] px-[24px] py-[16px] rounded-[100px] h-[56pxpx] w-full bg-[#5042DA] text-white text-[16px] font-rubik font-[600]' onClick={handleFundWallet}>
                    Next
                </button>
    </div>
  )
}

export default FundWallet
