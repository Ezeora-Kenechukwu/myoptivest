import React from 'react'
import AppLayout from '../../layouts/app-layout'
import { Head, Link, useForm } from '@inertiajs/react'
import { HiMiniArrowTrendingDown, HiMiniArrowTrendingUp } from 'react-icons/hi2'
import DataTable from "@/components/DataTable";
import StatusBadge from '@/components/StatusBadge';
import { FaEllipsisVertical, FaEye } from 'react-icons/fa6';
import DropdownComponent from "@/components/DropdownComponent";
import { FiZap } from "react-icons/fi";
import { MdArrowOutward } from 'react-icons/md';
import formatDate from "@/utils/formatDate";
import Modal from '@/components/Modal'

const transactionColumns = [
  { name: "Transaction Id", selector: "id", sortable: true },
  { name: "Date", selector: "created_at", sortable: true },
  { name: "Plan Name", selector: "investment_plan", sortable: true },
  { name: "Amount", selector: "invest_amount", sortable: true },
  {
    name: "Status",
    selector: "status",
    sortable: true,
  },
  {
    name: "Total Expected Return",
    selector: "total_expected_return",
    sortable: true,
  },
   { name: "Payout Frequency", selector: "payout_frequency", sortable: true },
   { name: "Return on Investment", selector: "total_expected_profit", sortable: true },
//   { name: "Type", selector: "type", sortable: true },
  {
    name: "Action",
    selector: "action",
    sortable: false,
  },
];


const UserInvestments = ({breadcrumbs, auth:user, investments}) => {
    console.log('plan plans', investments);
        const myInfo = [
    {
        id:1,
        title:"Investments",
        value: 0,
        kpi: 15,
        kpi_direction: 'down',
        vs:"last month"
    },

];

const {data, setData, post, processing,errors} = useForm({
        id: null,
        showInvestModal: false,
        showViewInvestmentModal: false,
        plan_id: null,
        plan:null,
        amount: null,
        method_id: null,
        method: null,
        proof: null,
        pay_with_monify:null,
        showFund:false,


    })
const investmentsDetails = investments.length > 0
  ? investments.map(item => {
      const {
        id,
        created_at,
        updated_at,
        category,
        invest_amount,
        total_expected_profit,
        total_expected_return,
        plan,
        amount,
        status,
        payment_method,
        type
      } = item;

      return {
        ...item,
        created_at:formatDate(created_at),
        investment_plan:plan?.name,
        total_expected_return:`₦${invest_amount + total_expected_profit}`,

        status: <StatusBadge status={status} />,
        action: (
          <DropdownComponent buttonText={<FaEllipsisVertical />} buttonClass={``}>
            <button className="flex items-center justify-center gap-2 cursor-pointer" onClick={() => handleViewInvestment(item)}>
              <FaEye /> View
            </button>
          </DropdownComponent>
        ),
      };
    })
  : []

const handleStartInvesting = (plan) => {
    console.log("plan", plan);
  if (user.user.wallet >= plan?.min_amount) {
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

// const calculatePayouts = (minAmount, roi, duration) => {
//   const total_payout = minAmount + (minAmount * (roi / 100) * duration);
//   const weekly_payout = total_payout / (duration * 4); // weeks per month
//   const monthly_payout = total_payout / duration;
//   return { total_payout, weekly_payout, monthly_payout };
// };
const handleViewInvestment = (investment) => {
  const { plan, invest_amount } = investment;
//   const { roi, duration, min_amount } = plan;

//   const {
//     total_payout,
//     weekly_payout,
//     monthly_payout
//   } = calculatePayouts(min_amount || invest_amount, roi, duration);

  setData({
    ...data,
    plan: investment,
    // total_payout,
    // weekly_payout,
    // monthly_payout,
    showViewInvestmentModal: true
  });
  console.log("new investment visuals", investment);
};

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
                    <Head title="Investment" />
                    <div className="">
                <div className="flex flex-wrap gap-4 items-center justify-start mt-4 bg-[#F5F5F5] p-[8px] rounded-2xl">
                {
                    investments?.map(item => {
                        const {plan,invest_amount} = item
                        return (
                            <article className="w-[270px] bg-white rounded-[8px] h-[100px] border border-[#E9EAEB] p-[12px] flex flex-col justify-between ">
                              <h4 className="text-[#717680] font-inter font-[400px] text-[14px] space-y-5">
                                                    {plan?.name}
                                                </h4>
                             <div className="flex justify-between items-center">
                                 <h4 className='text-[#0A0D12] text-[24px] font-[400] font-inter'>{invest_amount.toLocaleString()}</h4>
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
                            <div className="p-[8px]">
                                            <h1 className='text-[#23272E] font-rubik font-[500] text-[20.97px] mb-5'>Recent Investment</h1>
                                           <DataTable
                              data={investmentsDetails}
                              columns={transactionColumns}
                              sortableColumns={["type", "category", "payment_method", "amount", "status"]}
                              globalFilter={["category", "payment_method", "type"]}
                              emptyInfo={
          <div className="flex flex-col items-center justify-center col-span-full text-center py-10 w-full">
            <FiZap className="text-4xl text-[#533DD7] mb-2" />
            <h1 className="text-[#0A0D12] font-normal text-[19.44px]">No Investment Yet</h1>
            <p className="text-[#717680] mb-4">Your section is empty, please start investing to get started</p>
            <Link href="/investments/create"  className="bg-[#533CD6] hover:bg-blue-700  w-fit text-white px-4 py-2 rounded-lg border-[#513DD6] border-[1.22px] flex items-center gap-3">
              Start Investing
              <MdArrowOutward />
            </Link>
          </div>}
                            />

                                        </div>
                    </div>
                    {/* The view modal */}
                    {data.showViewInvestmentModal && (
  <Modal
    show={data.showViewInvestmentModal} onClose={() => setData('showViewInvestmentModal', false)}
  >
    <div className="p-4 max-w-xl w-full mx-auto max-h-[90vh] overflow-y-auto bg-white rounded-lg">
         <h2 className="text-2xl font-bold text-gray-800">{data.plan?.plan?.name}</h2>
        <p className="text-gray-500 italic">{data.plan?.plan?.short_description}</p>
        {/* Divider */}
        <div className="w-full h-px bg-gray-200 my-4" />

      <p><strong>Amount Invested:</strong> ₦{data.plan?.invest_amount?.toLocaleString()}</p>
      <p><strong>Total Expected Profit:</strong> {data.plan?.
total_expected_profit}</p>
      <p><strong>Duration:</strong> {data.plan?.plan?.duration} months</p>
      <hr className="my-2" />
      {/* <h4 className="font-semibold">Payout Calculations</h4>
      <p><strong>Total Payout:</strong> ₦{data.total_payout?.toFixed(2)}</p>
      <p><strong>Weekly Payout:</strong> ₦{data.weekly_payout?.toFixed(2)}</p>
      <p><strong>Monthly Payout:</strong> ₦{data.monthly_payout?.toFixed(2)}</p> */}
    </div>
  </Modal>
)}

          </AppLayout>
  )
}

export default UserInvestments
