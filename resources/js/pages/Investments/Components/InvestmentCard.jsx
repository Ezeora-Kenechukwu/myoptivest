import React from 'react'
import formatDuration from '../../../utils/formatDuration'
import { useForm } from '@inertiajs/react'

const InvestmentCard = ({plan,data, setData}) => {


    const {name,
        min_amount,
        max_amount,
        roi,
        duration,
        payout_frequency,
        short_description,
        long_description,
        thumbnail,
        photos} = plan
  return (
    <>
    <div className='bg-white shadow-md rounded-lg p-4 min-w-[250px] max-w-[300px] min-h-[400px] pb-6'>
        <img src={`/storage/${thumbnail}`} alt={name} className='w-full h-[200px] object-cover rounded-lg' />
        <div className='flex justify-between items-center mt-2'>
            <h2 className='text-sm font-semibold'>{name}</h2>
            <span className='text-sm text-gray-500'>₦{min_amount.toLocaleString()} - {max_amount ? `₦${max_amount.toLocaleString()}` : "N/A"}</span>

        </div>
        <div className='flex justify-between items-center mt-2'>
            <h2 className='text-sm font-semibold'>ROI:</h2>
            <span className='text-sm text-gray-500'>{roi}%</span>

        </div>
        <div className='flex justify-between items-center mt-2'>
            <h2 className='text-sm font-semibold'>Duration:</h2>
            <span className='text-sm text-gray-950 px-2 bg-green-100 rounded-lg'>{formatDuration(duration)}</span>

        </div>
        <div className='flex justify-between items-center mt-2'>
            <h2 className='text-sm font-semibold'>Payout: </h2>
            <span className='text-sm text-gray-500'>{payout_frequency}</span>

        </div>

        <p className='text-sm text-gray-500 my-2'>{short_description}</p>

        <div className='flex justify-between items-center mt-2'>
            <button className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition  cursor-pointer' onClick={() => setData({...data, showViewInvestmentModal: true, plan:plan})}>View Details</button>
            <button className='bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400 transition cursor-pointer' onClick={() => setData({...data, showInvestModal: true, plan:plan})} >Invest</button>

            </div>
    </div>
    </>
  )
}

export default InvestmentCard
