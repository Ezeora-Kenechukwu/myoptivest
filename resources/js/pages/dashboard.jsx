import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import DataTable from "@/components/DataTable";
import DropdownComponent from "@/components/DropdownComponent";
import formatDate from "@/utils/formatDate";
import { Head, Link,router, useForm, usePage } from "@inertiajs/react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { HiChevronRight } from "react-icons/hi";
import SweetAlert from "@/components/SweetAlert";
import AppLayout from '@/layouts/app-layout';

import { FaEllipsisVertical } from "react-icons/fa6";
import Modal from '@/components/Modal';
import { useState } from 'react';
import { FaUsers, FaCrown, FaChartLine, FaCalendarCheck, FaAirFreshener, FaArrowUp, FaRegStar, FaWallet, FaArrowRight } from 'react-icons/fa';
import { MdOutlineCelebration, MdLeaderboard } from 'react-icons/md';
import { BsClockHistory, BsPersonBoundingBox } from 'react-icons/bs';
import { AiFillFire, AiOutlineCheckCircle } from 'react-icons/ai';
import { IoMdRocket } from 'react-icons/io';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { FaUserCircle } from 'react-icons/fa';
import { HiMiniArrowTrendingUp,HiMiniArrowTrendingDown  } from "react-icons/hi2";
import { CgArrowBottomRight } from "react-icons/cg";
import { CgArrowTopRight } from "react-icons/cg";
import FundWallet from './Dashboard/FundWallet'
import CardPayment from './Dashboard/CardPayment'
import BankTransfer from './Dashboard/BankTransfer'
import {
    Star,
    ShieldCheck,
    ThumbsUp,
    Gem,
    UsersRound,
    Trophy,
    Rocket,
    Activity
  } from 'lucide-react';
// import {
//     ArrowDownIcon,
//     ArrowUpIcon,
//     BoxIconLine,
//     GroupIcon,
//   } from "@/icons";
  import Badge from "@/components/ui/badge/Badge";



import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { FaRegCircleDot } from "react-icons/fa6";
import StatusBadge from '@/components/StatusBadge';
import SavingsStatusChart from './Dashboard/SavingsStatusChart';
import DonutChart from './Dashboard/DonutChart';
import PageLoader from '@/components/PageLoader';
import Preloader from '@/components/PreLoader';

// Status Badge component


const transactionColumns = [
  { name: "Transaction Id", selector: "id", sortable: true },
  { name: "Date", selector: "created_at", sortable: true },
  { name: "Category", selector: "category", sortable: true },
  { name: "Amount", selector: "amount", sortable: true },
  {
    name: "Status",
    selector: "status",
    sortable: true,
  },
  { name: "Type", selector: "type", sortable: true },
  { name: "Payment Method", selector: "payment_method", sortable: true },
  {
    name: "Action",
    selector: "action",
    sortable: false,
  },
];

const transactions = [
  {
    id: 1,
    created_at: "2025-06-19",
    updated_at: "2025-06-19",
    category: "loan",
    amount: 2000,
    status: "success",
    payment_method: "Bank Transfer",
    type: "loan repay",
  },
  {
    id: 2,
    created_at: "2025-06-18",
    updated_at: "2025-06-18",
    category: "investment",
    amount: 10000,
    status: "pending",
    payment_method: "Credit Card",
    type: "deposit",
  },
  {
    id: 3,
    created_at: "2025-06-17",
    updated_at: "2025-06-17",
    category: "savings",
    amount: 5000,
    status: "failed",
    payment_method: "Mobile Payment",
    type: "deposit",
  },
  {
    id: 4,
    created_at: "2025-06-16",
    updated_at: "2025-06-16",
    category: "contribution",
    amount: 4500,
    status: "success",
    payment_method: "Bank Transfer",
    type: "interest",
  },
  {
    id: 5,
    created_at: "2025-06-15",
    updated_at: "2025-06-15",
    category: "investment",
    amount: 7500,
    status: "success",
    payment_method: "Mobile Payment",
    type: "savings charge",
  },
  {
    id: 6,
    created_at: "2025-06-14",
    updated_at: "2025-06-14",
    category: "savings",
    amount: 12000,
    status: "pending",
    payment_method: "Credit Card",
    type: "deposit",
  },
  {
    id: 7,
    created_at: "2025-06-13",
    updated_at: "2025-06-13",
    category: "loan",
    amount: 3200,
    status: "failed",
    payment_method: "Bank Transfer",
    type: "loan repay",
  },
  {
    id: 8,
    created_at: "2025-06-12",
    updated_at: "2025-06-12",
    category: "investment",
    amount: 15000,
    status: "success",
    payment_method: "Mobile Payment",
    type: "deposit",
  },
  {
    id: 9,
    created_at: "2025-06-11",
    updated_at: "2025-06-11",
    category: "contribution",
    amount: 3000,
    status: "pending",
    payment_method: "Credit Card",
    type: "savings charge",
  },
  {
    id: 10,
    created_at: "2025-06-10",
    updated_at: "2025-06-10",
    category: "savings",
    amount: 9500,
    status: "success",
    payment_method: "Bank Transfer",
    type: "interest",
  },
  // 10 more
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 11 + i,
    created_at: `2025-06-${9 - i}`.padStart(2, "0"),
    updated_at: `2025-06-${9 - i}`.padStart(2, "0"),
    category: ["savings", "loan", "investment", "contribution"][i % 4],
    amount: Math.floor(Math.random() * 20000) + 1000,
    status: ["success", "pending", "failed"][i % 3],
    payment_method: ["Bank Transfer", "Credit Card", "Mobile Payment"][i % 3],
    type: ["deposit", "loan repay", "interest", "savings charge"][i % 4],
  })),
];


export default function Dashboard({ auth: user }) {
    const [showAlert, setShoaAlert] = useState(user?.user?.should_activate_membership && user?.user?.membership_status !== 'accepted' ? true : false);

    const {data, setData, errors, processing} = useForm({
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
        loading:false

    })
//     {
//     "transactionReference": "MNFY|02|20250622064946|000420",
//     "paymentReference": "TRX_685799788e792",
//     "checkoutUrl": "https://sandbox.sdk.monnify.com/checkout/MNFY|02|20250622064946|000420",
//     "account": {
//         "accountNumber": "2219612453",
//         "accountName": "Kencodict Tech-Wal",
//         "bankName": "Sterling bank",
//         "expiry": "2025-06-22T07:29:48",
//         "ussdCode": "*945*2219612453*40000.00#"
//     }
// }
    const breadcrumbs = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ];
   console.log('==============Dashboard User======================');
   console.log(user);
   console.log('====================================');

const transactionsDetails =  transactions.map(item => {
    const { id,
    created_at,
    updated_at,
    category,
    amount,
    status,
    payment_method,
    type} = item

    return {
        ...item,
        status: <StatusBadge status={status} />,
        action: <DropdownComponent
        buttonText={<FaEllipsisVertical />}
        buttonClass={``}
        >
            <button className="flex items-center justify-center gap-2 cursor-pointer">
                <FaEye /> View
            </button>
             </DropdownComponent>,
    }
})

    // const icons = [
    //     <FaUsers className="text-gray-800 size-6 dark:text-white/90" />,
    //     <FaCrown className="text-gray-800 size-6 dark:text-white/90" />,
    //     <FaChartLine className="text-gray-800 size-6 dark:text-white/90" />,
    //     <FaCalendarCheck className="text-gray-800 size-6 dark:text-white/90" />,
    //     <FaAirFreshener className="text-gray-800 size-6 dark:text-white/90" />,
    //     <FaRegStar className="text-gray-800 size-6 dark:text-white/90" />,
    //     <FaWallet className="text-gray-800 size-6 dark:text-white/90" />,
    //     <MdOutlineCelebration className="text-gray-800 size-6 dark:text-white/90" />,
    //     <MdLeaderboard className="text-gray-800 size-6 dark:text-white/90" />,
    //     <BsClockHistory className="text-gray-800 size-6 dark:text-white/90" />,
    //     <BsPersonBoundingBox className="text-gray-800 size-6 dark:text-white/90" />,
    //     <AiFillFire className="text-gray-800 size-6 dark:text-white/90" />,
    //     <AiOutlineCheckCircle className="text-gray-800 size-6 dark:text-white/90" />,
    //     <IoMdRocket className="text-gray-800 size-6 dark:text-white/90" />,
    //     <HiOutlineUserGroup className="text-gray-800 size-6 dark:text-white/90" />,

    //     <Star className="text-gray-800 size-6 dark:text-white/90" />,
    //     <ShieldCheck className="text-gray-800 size-6 dark:text-white/90" />,
    //     <ThumbsUp className="text-gray-800 size-6 dark:text-white/90" />,
    //     <Gem className="text-gray-800 size-6 dark:text-white/90" />,
    //     <Trophy className="text-gray-800 size-6 dark:text-white/90" />
    //   ];
const myInfo = [
    {
        id:1,
        title:"Main Balance",
        value: 500000,
        kpi: 20,
        kpi_direction: 'up',
        vs:"last month"
    },
    {
        id:2,
        title:"Investments",
        value: 152000,
        kpi: 15,
        kpi_direction: 'down',
        vs:"last month"
    },
    {
        id:1,
        title:"Total Savings",
        value: 45674,
        kpi: 2,
        kpi_direction: 'down',
        vs:"last month"
    },
    {
        id:1,
        title:"Opti assets",
        value: 15000,
        kpi: 2,
        kpi_direction: 'down',
        vs:"last month"
    },
]

console.log('================data====================');
console.log(data);
console.log('====================================');
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
          <section className="px-3 sm:px-5 lg:px-7">
            {/* <FundWallet data={data} setData={setData} errors={errors} processing={processing}   />
            <CardPayment data={data} setData={setData} errors={errors} processing={processing}   />
            <BankTransfer data={data} setData={setData} errors={errors} processing={processing}   /> */}
              <div className="flex  justify-between items-center py-4 ">
              <h2 className='font-inter text-xl font-[400] text-[#0A0D12] space-y-5'>Welcom, {user?.user?.username}</h2>
              <DateRangePicker onUpdate={() => {}} initialDateFrom={new Date()} initialDateTo={new Date()} range={true} />
            </div>

            <div className="flex flex-wrap gap-4 items-center justify-center mt-4 bg-[#F5F5F5] p-[8px] rounded-2xl">
                {
                    myInfo.map(item => {
                        return (
                            <article className="w-[270px] bg-white rounded-[8px] h-[100px] border border-[#E9EAEB] p-[12px] flex flex-col justify-between ">
                                <h4 className="text-[#717680] font-inter font-[400px] text-[14px] space-y-5">
                                    {item.title}
                                </h4>
                                <div className="flex justify-between items-center">
                                    <h4 className='text-[#0A0D12] text-[24px] font-[400] font-inter'>{item.value.toLocaleString()}</h4>
                                    <div className="flex gap-2 items-center">
                                        <p className={`flex text-[12px] items-center px-[4px] py-[2px] border rounded-[4px]  ${item.kpi_direction == 'up' ? "bg-[#ABEFC6] text-[#17B26A] border-[#ABEFC6]" : "bg-[#FECDCA] text-[#F04438] border-[#FECDCA]"}`}>
                                           {item.kpi_direction == 'up' ? <HiMiniArrowTrendingUp />
                                            : <HiMiniArrowTrendingDown  /> } {item.kpi}%
                                        </p>
                                        <p className='text-[12px] font-[400] font-inter text-[#A4A7AE] '>vs {item.vs}</p>
                                    </div>
                                </div>
                            </article>
                        )
                    })
                }
            </div>

            <div className="flex justify-end items-center my-4 gap-4">
                <button className='border border-[#5042DA] px-[24px] py-[16px] rounded-[16.72px] h-[56pxpx] w-[185px] text-[#5042DA] text-[16px] font-rubik font-[600]' onClick={() => setData('showFund', !data.showFund)}>
                    Fund
                </button>
                <button className='border bg-[#5042DA] border-[#5042DA] px-[24px] py-[16px] rounded-[16.72px] h-[56pxpx] w-[185px] text-white text-[16px] font-rubik font-[600]'>
                    Withdraw
                </button>
            </div>

            <div className="">
                <h1 className='text-[#23272E] font-rubik font-[500] text-[20.97px] mb-5'>Recent Transactions</h1>
               <DataTable
  data={transactionsDetails}
  columns={transactionColumns}
  sortableColumns={["type", "category", "payment_method", "amount", "status"]}
  globalFilter={["category", "payment_method", "type"]}
/>

            </div>

            <div className="my-4 flex flex-wrap items-center gap-4 justify-evenly">
                <SavingsStatusChart />
                <DonutChart  />


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
    data.loading && (
        <Preloader settings={''} />
    )
}
            </div>
          </section>

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
        </AppLayout>
    );
}


