import React, { useEffect, useState } from 'react'
import WelcomeLayout from '@/layouts/welcome-layout'
import Celebs from '@/pages/Welcome/Celebs'
import CelebritiesBanner from './Celebs/CelebritiesBanner';

const Celebrities = ({celebrities, categories}) => {
    console.log('==========categories==========================');
    console.log(categories);
    console.log('====================================');
    const [filteredCategory, setFilteredCategory] = useState(celebrities)
   const handleCategoryFilter = (id) => {
    setFilteredCategory(celebrities.filter(item=>item.category_id == id))
   }
  return (
    <WelcomeLayout>
       <CelebritiesBanner setFilteredCategory={setFilteredCategory} filteredCategory={filteredCategory} celebrities={celebrities}  />

       <div className="flex gap-5 items center justify-center flex-wrap my-10">
       <button className="bg-slate-950 py-2 px-4 rounded-xl cursor-pointer shadow-sm text-white"  onClick={()=> setFilteredCategory(celebrities)}>All</button>
       {
        categories.map(item => {
            return (
                <button className="bg-slate-950 py-2 px-4 rounded-xl shadow-sm cursor-pointer text-white" key={item.id} onClick={()=> handleCategoryFilter(item.id)}>{item.name}</button>
            )
        })
    }
       </div>
<Celebs celebrities={filteredCategory} />
    </WelcomeLayout>
  )
}

export default Celebrities
