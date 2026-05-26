
import React from 'react'

import { Head, Link, useForm } from '@inertiajs/react'
import { HiChevronRight } from 'react-icons/hi'
import { HiStopCircle } from 'react-icons/hi2'
import AppLayout from '../../layouts/app-layout'
import InvestmentCard from './Components/InvestmentCard'
import Modal from '@/components/Modal'
import InputLabel from "@/components/InputLabel";
import TextInput from "@/components/TextInput";
import InputError from "@/components/InputError";
import TextArea from "@/components/TextArea";
import CopyButton from "@/components/CopyButton";
import FileUpload from "@/components/FileUpload";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import formatDuration from '../../utils/formatDuration'
import StatusBadge from '@/components/StatusBadge';
import DropdownComponent from "@/components/DropdownComponent";
import { FaEllipsisVertical, FaEye } from 'react-icons/fa6';
import DataTable from "@/components/DataTable";
import FundWallet from '../Dashboard/FundWallet';
import { GiPayMoney } from "react-icons/gi";
import CardPayment from '../Dashboard/CardPayment'
import BankTransfer from '../Dashboard/BankTransfer'
import Preloader from '@/components/PreLoader';
import formatDate from "@/utils/formatDate";
const transactionColumns = [
  { name: "Tier", selector: "id", sortable: true },
  { name: "Plan Name", selector: "name", sortable: true },
   { name: "Amount Required", selector: "min_amount", sortable: true },
  { name: "Duration", selector: "duration", sortable: true },
  { name: "TOTAL PAYOUT (1.4X)", selector: "total_payout", sortable: true },
  { name: "Monthly PAYOUT (1.4X)", selector: "monthly_payout", sortable: true },
  { name: "Weekly PAYOUT (1.4X)", selector: "weekly_payout", sortable: true },
  { name: "TAGLINE", selector: "short_description", sortable: true },
  {
    name: "Action",
    selector: "action",
    sortable: false,
  },
];
const investments = [
  {
    id: 1,
    plan_name:"Optispark",
    amount: 2000,
    duration:"12 months , 40% ROI",
    total_payout:"N175,000",
    monthly_payout:"N175,000",
    weekly_payout:"N175,000",
    tagline:"Ignite your investing Journey",
  },
  {
    id: 2,
    plan_name:"Optilauch",
    amount: 10000,
    duration:"12 months , 40% ROI",
    total_payout:"N175,000",
    monthly_payout:"N175,000",
    weekly_payout:"N175,000",
    tagline:"Limit- off with steady growth",
  },
  {
    id: 3,
    plan_name:"Optispark",
    amount: 5000,
    duration:"12 months , 40% ROI",
    total_payout:"N175,000",
    monthly_payout:"N175,000",
    weekly_payout:"N175,000",
    tagline:"Ignite your investing Journey",
  },
  {
    id: 4,
    plan_name:"Optispark",
    amount: 4500,
    duration:"12 months , 40% ROI",
    total_payout:"N175,000",
    monthly_payout:"N175,000",
    weekly_payout:"N175,000",
    tagline:"Ignite your investing Journey",
  },
  {
    id: 5,
    plan_name:"Optispark",
    amount: 7500,
    duration:"12 months , 40% ROI",
    total_payout:"N175,000",
    monthly_payout:"N175,000",
    weekly_payout:"N175,000",
    tagline:"Ignite your investing Journey",

  },

];
const Create = ({plans, manual_payment_methods, auth:user}) => {
    console.log('=========manual_payment_methods===========================');
    console.log(manual_payment_methods);
    console.log(plans, 'plans');
    console.log('================manual_payment_methods====================');

    console.log('user', user.user.wallet);

    const calculatePayouts = (min_amount, roi, duration) => {
  const totalDays = duration / 24;
  const totalWeeks = totalDays / 7;
  const totalMonths = totalDays / 30.44;

  const roiAmount = (roi / 100) * min_amount;
  const totalPayout = min_amount + roiAmount;

  const weeklyPayout = totalPayout / totalWeeks;
  const monthlyPayout = totalPayout / totalMonths;

  return {
    total_payout: `₦${totalPayout.toFixed(2)}`,
    weekly_payout: `₦${weeklyPayout.toFixed(2)}`,
    monthly_payout: `₦${monthlyPayout.toFixed(2)}`,
  };
};


    const {data, setData, post, processing,errors} = useForm({
        id: null,
        showInvestModal: false,
        showViewInvestmentModal: false,
        plan_id: null,
        plan:null,
        method_id: null,
        method: null,
        proof: null,
        pay_with_monify:null,
 wallet_type:"Optivest Wallet",
        amount:0,
        charges:0,
        payment_method:'',
        bankName:'',
        expiry_month:'',
        expiry_year:'',
        cvv:'',
        alert:null,
        transactionReference:'',
        paymentReference:'',
        card_number:'',
        accountNumber:'0766123852',
        accountName:'Olamide Samuel',
        customer_name:user.user.name,
        customer_email:user.user.email,
        showFund:false,
        showCardCharge:false,
        showTransfer:false,
        loading:false,
        deviceInformation:[],
        cardType:'',
        redirectUrl:'',
        pin:'',
        // withdrawal
        withdrawal_amount: 0,
        withdrawal_account_number: '',
        withdrawal_bank: '',
        withdrawal_account_name: '',

    })
    const breadcrumbs = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        // {
        //     title: 'Payment Method Settings',
        //     href: '/manual-payment-methods',
        // },
        {
            title: 'Opti Assets',
            href: '/investments/create',
        },



    ];

    const handleInvest = (amount, plan_id) => {
//   e.preventDefault();

  setData((prevData) => ({
    ...prevData,
    plan_id: plan_id,
    amount: amount,
  }));

  post(route('investments.store'), {
    preserveScroll: true,
    onSuccess: () => setData('showInvestModal', false),
    onError: (errors) => {
      console.log('Validation errors:', errors);
    }
  });
};


    const handleViewInvestment = (investment) => {
  const { min_amount, roi, duration } = investment;

  const {
    total_payout,
    weekly_payout,
    monthly_payout
  } = calculatePayouts(min_amount, roi, duration);

  setData({
    ...data,
    plan: investment,
    total_payout,
    weekly_payout,
    monthly_payout,
    showViewInvestmentModal: true
  });
  console.log("my new investment", investment);

};
const handleStartInvesting = (plan) => {
  if (user.user.wallet >= plan.min_amount) {
    setData({
      ...data,
      plan,
      showViewInvestmentModal: false,
      showInvestModal: true
    });
  } else {
    setData({
      ...data,
      plan,
      showViewInvestmentModal: false,
      showInsufficientFundsModal: true
    });
  }
};


    const investmentsDetails = plans.length > 0
  ? plans.map(item => {
      const {
        id,
        name,
        roi,
        duration,
        min_amount,
        short_description
      } = item;

      const {
        total_payout,
        weekly_payout,
        monthly_payout
      } = calculatePayouts(min_amount, roi, duration);

      return {
        id,
        name,
        roi,
        duration,
        min_amount,
        short_description,
        total_payout,
        weekly_payout,
        monthly_payout,
        action: (
          <DropdownComponent buttonText={<FaEllipsisVertical />} buttonClass={``} className='flex'>
            <button
              className="flex items-center justify-center gap-2 cursor-pointer"
              onClick={() => handleViewInvestment(item)}
            >
              <FaEye /> View
            </button>
            <button
              onClick={() => handleStartInvesting(item)}
              className="flex items-center justify-center gap-2 cursor-pointer"
            >
              <GiPayMoney /> Invest now
            </button>
          </DropdownComponent>
        ),
      };
    })
  : [];

  return (

// convert one week to hours. 24 hours * 7days = 168 hours
// duration divided by 168 hours calculated so that we will use it to get number the number of weeks.
// use the number of weeks to divide the total return on investment
<AppLayout breadcrumbs={breadcrumbs}>
        <Head title="ManualPaymentMethod Settings" />

    <div className="p-[8px]">
                                                {/* <h1 className='text-[#23272E] font-rubik font-[500] text-[20.97px] mb-5'>Recent Investment</h1> */}
                                               <DataTable
                                  data={investmentsDetails}
                                  columns={transactionColumns}
                                  sortableColumns={["type", "category", "payment_method", "min_amount", "status"]}
                                  globalFilter={["category", "payment_method", "type"]}
                                />

                                            </div>
        {/* <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <section className="w-full h-full rounded-lg shadow shadow-slate-950 dark:shadow-slate-500 p-4">
        <ManualPaymentMethodForm />
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Make Investment</h2>
            <p className="text-sm text-gray-500">Select a plan and payment method to make an investment.</p>
            <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold">Investment Plans</h3>
                <section className=" pl-5 flex flex-wrap gap-5 justify-center">
                    {plans.map(plan => (
                       <InvestmentCard key={plan.id}
                       data={data} setData={setData} manual_payment_methods={manual_payment_methods} plan={plan} />
                    ))}
                </section>
                <h3 className="text-lg font-semibold">Payment Methods</h3>
                <ul className="list-disc pl-5">
                    {manual_payment_methods.map(method => (
                        <li key={method.id} className="mb-2">
                            <Link href={`/investments/${method.id}/create`} className="text-blue-500 hover:underline">
                                {method.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        <div className="flex flex-col gap-4 mt-4">
            <h3 className="text-lg font-semibold">Investment History</h3>
            <p className="text-sm text-gray-500">View your past investments and their statuses.</p>
            <Link href="/investments/history" className="text-blue-500 hover:underline">
                View Investment History
            </Link>
        </div>

</section>
</div> */}

{data.showViewInvestmentModal && (
  <Modal show={data.showViewInvestmentModal} onClose={() => setData('showViewInvestmentModal', false)}>
    <section className="p-4 max-w-xl w-full mx-auto max-h-[90vh] overflow-y-auto bg-white rounded-lg">
      <div className="flex flex-col gap-4 items-center text-center">
        <h2 className="text-2xl font-bold text-gray-800">{data.plan.name}</h2>
        <p className="text-gray-500 italic">{data.plan.short_description}</p>
        {/* Divider */}
        <div className="w-full h-px bg-gray-200 my-4" />

        <div className="grid grid-cols-2 gap-4 text-left w-full mt-4 text-sm text-gray-700">
          <div>
            <strong>Amount Required:</strong><br /> ₦{Number(data.plan.min_amount)}
          </div>
          <div>
            <strong>Duration:</strong><br /> {data.plan.duration}
          </div>
          <div>
            <strong>Total Payout:</strong><br /> {data.total_payout}
          </div>
          <div>
            <strong>Monthly Payout:</strong><br /> {data.monthly_payout}
          </div>
          <div>
            <strong>Weekly Payout:</strong><br /> {data.weekly_payout}
          </div>
        </div>

             {/* Divider */}
        <div className="w-full h-px bg-gray-200 my-4" />

        <div className="flex justify-between w-full mt-6 gap-4">
          <button
            onClick={() => setData('showViewInvestmentModal', false)}
            className="w-full bg-red-500 hover:bg-red-700 text-gray-100 px-4 py-2 rounded-lg transition"
          >
            Close
          </button>
          <button
            onClick={() => handleStartInvesting(data.plan)}
            className="w-full bg-[#533CD6] hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Start Investing
          </button>
        </div>
      </div>
    </section>
  </Modal>
)}

{/* Insufficient fund modal */}
{data.showInsufficientFundsModal && (
  <Modal show={data.showInsufficientFundsModal} onClose={() => setData('showInsufficientFundsModal', false)}>
    <section className="p-6 w-full max-w-md mx-auto text-center bg-white rounded-lg">
      <h2 className="text-2xl font-bold text-red-600">Insufficient Wallet Balance</h2>
      <p className="text-gray-700 mt-4">
        Your wallet balance is <strong>₦{user.user.wallet}</strong>, but the selected plan requires <strong>₦{data.plan.min_amount}</strong>.
      </p>
      <div className="mt-6 flex gap-3">
         <button className='border border-[#5042DA] px-[24px] py-[16px] rounded-[16.72px] h-[56pxpx] w-[185px] text-[#FDFDFD] bg-[#513ED7] text-[16px] font-rubik font-[600] hover:bg-[#6F20C4]' onClick={() => setData('showFund', !data.showFund)}>
                    Fund Wallet
                </button>
        <button
          onClick={() => setData('showInsufficientFundsModal', false)}
          className="bg-red-500 hover:bg-red-700 text-gray-100 px-[24px] py-[16px] rounded-[16.72px] h-[56pxpx] w-[185px] transition"
        >
          Cancel
        </button>
      </div>
    </section>
  </Modal>
)}

{/* Logic for fund wallet */}
 {
     data.showFund && (
     <Modal show={data.showFund} onClose={() => setData('showFund', false)}>
     <div className={`py-4 max-h-[750px] overflow-y-auto px-5`}>
 <div className="flex items-center justify-end">
 <button className="text-xl font-rubik font-bold rotate-90 pr-5 cursor-pointer" onClick={() => setData('showFund', false)}>X</button>
 </div>
 <FundWallet data={data} setData={setData} errors={errors} processing={processing}   />
     </div>

     </Modal>
 )
 }
 {
     data.showTransfer && (
     <Modal show={data.showTransfer} onClose={() => setData('showTransfer', false)}>
     <div className={`py-4 max-h-[750px] overflow-y-auto px-5`}>
 <div className="flex items-center justify-end">
 <button className="text-xl font-rubik font-bold rotate-90 pr-5 cursor-pointer" onClick={() => setData('showTransfer', false)}>X</button>
 </div>
 <BankTransfer data={data} setData={setData} errors={errors} processing={processing}   />
     </div>

     </Modal>
 )
 }
 {
     data.showCardCharge && (
     <Modal show={data.showCardCharge} onClose={() => setData('showCardCharge', false)}>
     <div className={`py-4 max-h-[750px] overflow-y-auto px-5`}>
 <div className="flex items-center justify-end">
 <button className="text-xl font-rubik font-bold rotate-90 pr-5 cursor-pointer" onClick={() => setData('showCardCharge', false)}>X</button>
 </div>
 <CardPayment data={data} setData={setData} errors={errors} processing={processing}   />
     </div>

     </Modal>
 )
 }
 {
     data.loading && (
         <Preloader settings={''} />
     )
 }
{data.alert && (
  <SweetAlert
    success={data.alert?.success}
    error={data.alert?.error}
    warning={data.alert?.warning}
    info={data.alert?.info}
    message={data?.alert?.message}
    action={() => setData('alert',null)}
  />
)}

{/* {data.showViewInvestmentModal && (
  <Modal show={data.showViewInvestmentModal} onClose={() => setData('showViewInvestmentModal', false)}>
    <section className="p-4 max-w-xl w-full mx-auto max-h-[500px] overflow-y-auto">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center">{data.plan.name}</h2>
        <p className="text-sm text-center text-gray-600">{data.plan.short_description}</p>


        <Carousel
          showThumbs={false}
          showStatus={false}
          infiniteLoop
          autoPlay
          emulateTouch
          className="rounded-lg overflow-hidden"
        >
          {[data.plan.thumbnail, ...(data.plan.photos || [])].map((src, i) => (
            <div key={i}>
              <img
                src={`/storage/${src}`}
                alt={`Plan ${i + 1}`}
                className="object-cover w-full max-h-60 md:max-h-96 rounded-lg"
              />
            </div>
          ))}
        </Carousel>


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800 mt-4">
          <div>
            <strong>Minimum Amount:</strong> ₦{Number(data.plan.min_amount).toLocaleString()}
          </div>
          <div>
            <strong>Maximum Amount:</strong>{" "}
            {data.plan.max_amount ? `₦${Number(data.plan.max_amount).toLocaleString()}` : "No limit"}
          </div>
          <div>
            <strong>ROI:</strong> {data.plan.roi}%
          </div>
          <div>
            <strong>Payout Frequency:</strong> {data.plan.payout_frequency}
          </div>
          <div className="sm:col-span-2">
            <strong>Duration:</strong> {formatDuration(data.plan.duration)}
          </div>
        </div>


        {data.plan.long_description && (
          <div
            className="prose prose-sm prose-blue max-w-none mt-4"
            dangerouslySetInnerHTML={{ __html: data.plan.long_description }}
          />
        )}
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={() => setData('showViewInvestmentModal', false)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Close
        </button>
      </div>
    </section>
  </Modal>
)} */}

{
    data.showInvestModal && <Modal show={data.showInvestModal} closable={true} onClose={() => setData('showInvestModal', false)}>
        <section className='pl-5 flex flex-col gap-5 p-5 max-h-[500px] overflow-y-auto'>
            <div className="flex flex-col gap-4">
                 <h2 className="text-2xl font-bold">You are about to invest on ({data.plan.name}) <span className="">The amount required is ({data.plan.min_amount})</span> </h2>
                 <p className="">Click on the proceed button below to proceed to investment</p>
            </div>
            <div className="flex justify-between mt-4">
            <button onClick={() => setData('showInvestModal', false)} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                Cancel
            </button>
            <button onClick={() => handleInvest(data.plan.min_amount, data.plan.id)} className="bg-[#533CD6] text-white px-4 py-2 rounded-lg cursor-pointer">
                Invest
            </button>
        </div>
        </section>
      {/* <section className="pl-5 flex flex-col gap-5 p-5 max-h-[500px] overflow-y-auto ">
      <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Investment Form. You are investing on ({data.plan.name}) </h2>

            <h3 className='font-bold font-amarante'>Please select a payment method to proceed with your investment.</h3>

            <section className=" pl-5 flex flex-wrap gap-5 justify-center">
                {manual_payment_methods.map(method => (
                    <label key={method.id} className={` shadow-md rounded-lg p-4 min-w-[100px] max-w-[200px] min-h-[100px] pb-6 items-center justify-center cursor-pointer ${data.method_id === method.id ? 'border-2 border-blue-500 ' : ''}`}>
                        { <img src={method.icon ? `/storage/${method.icon}` : '/bank-transfer.svg'} alt={method.name} className='w-[100px] block mx-auto h-[100px] object-cover rounded-lg' /> }
                        <div className='flex justify-between items-center mt-2'>
                            <h2 className='text-sm font-semibold'>{method.name}</h2>
                            <span className='text-sm text-gray-500'>{method.description}</span>
                        </div>
                        <input type="radio" name="method_id" value={method.id} className="hidden" onChange={() => setData({...data, method:method, method_id:method.id})} />

                        <span className='text-sm text-gray-500'>{method.instructions}</span>
                    </label>
                ))}
                </section>

                {
                    data.method_id && (
                        <>
                    <div className="flex flex-col gap-4 mt-4">
                        <h3 className="text-lg font-semibold">Payment Instructions</h3>
                        <p className="text-sm text-gray-500">{data.method.instructions}</p>
                    </div>
                    {data.method.type === 'bank_transfer' ? <>
                        <div className="flex  gap-4  items-center">
                        <h3 className="text-lg font-semibold">Bank Name: </h3>
                        <p className="text-sm text-gray-500">{data.method.bank_name}</p>
                    </div>
                    <div className="flex  gap-4  items-center">
                        <h3 className="text-lg font-semibold">Account Number: </h3>
                        <div className="flex gap-2 items-center">
  <p className="text-sm text-gray-500">{data.method.account_number}</p>
  <CopyButton value={data.method.account_number} />
</div>
                    </div>
                    <div className="flex  gap-4  items-center">
                        <h3 className="text-lg font-semibold">Account Name: </h3>
                        <p className="text-sm text-gray-500">{data.method.account_name}</p>
                    </div>
                    </>
                    :
                    <>
                    <div className="flex  gap-4  items-center">
                        <h3 className="text-lg font-semibold">Name: </h3>
                        <p className="text-sm text-gray-500">{data.method.name}</p>
                    </div>
                    <div className="flex  gap-4  items-center">
                        <h3 className="text-lg font-semibold">Wallet Address: </h3>
                        <div className="flex gap-2 items-center">
  <p className="text-sm text-gray-500">{data.method.wallet_address}</p>
  <CopyButton value={data.method.wallet_address} />
</div>
                    </div>
                    </>
                    }

                    <div>
                        <h3 className="text-lg font-semibold">Make Sure To pay atleast The Minimum Amount for this selected investment Plan: </h3>
                        <p className="text-lg text-gray-950">₦{data.plan.min_amount} - {data.plan.max_amount ? `₦${max_amount}` : "N/A"}</p>
                    </div>
                    <div>
          <InputLabel htmlFor="amount" value=" Input The Amount You Transfered  " />
          <TextInput id="amount" type="number" value={data.amount} onChange={(e) => setData("amount", e.target.value)} className="mt-1 block w-full px-5 py-3" />
          <InputError message={errors.amount} className="mt-2" />
        </div>

        <div>

          <FileUpload
            label="Upload proof of Payment"
            name="proof"
            multiple={false}
            image={data.proof}
            setData={setData}
            accept={[".jpg", ".jpeg", ".png"]}
            error={errors.proof}
          />
        </div>
                    </>
                    )
                }


        </div>
        <div className="flex justify-between mt-4">
            <button onClick={() => setData('showInvestModal', false)} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                Cancel
            </button>
            <button onClick={handleInvest} className="bg-green-500 text-white px-4 py-2 rounded-lg cursor-pointer">
                Invest
            </button>
        </div>
        </section> */}

    </Modal>


}
    </AppLayout>
  )
}

export default Create
