import { Link } from '@inertiajs/react'
import React from 'react'
import { Fade, Slide, Zoom } from "react-awesome-reveal";
const Celebs = ({celebrities=[]}) => {
    console.log('=====celebrities===============================');
    console.log(celebrities);
    console.log('====================================');
  return (
     <Slide direction={'left'} cascade   >

        <div className="celebCont  mt-10 py-4 px-2 flex flex-wrap justify-center gap-y-12 gap-x-10 ">
        {
            celebrities.map(item => {
                const {id, name, age, bio, occupation, img, slug,thumbnail, category} = item
                return (
                   <Link href={`/celebrity/${slug}`} key={id}>
                    <div className="celeb1 py-4  dark:text-slate-950 bg-white shadow-md  place-items-center text-center rounded-xl w-80 h-fit" >
                    <div className=" justify-center text-center">
                     <img src={`/storage/${thumbnail}`} alt="Celebrity Icon" className='w-60 h-80 m-auto rounded-xl mt-2' />
                 <h5 className='text-xl font-extralight'><b>{name}</b></h5>
                
                 <p className="bio"><span dangerouslySetInnerHTML={{ __html: bio?.slice(0, 200) + "..." }} /> <br /> <strong>Occupation: {category?.name}</strong></p>
                 <Link href="/reservations/create" className='block rounded-2xl m-auto text-white font-amarante bg-orange-500 w-fit py-4 sm:py-4 px-2 mt-4'>Book Now!</Link>
                 </div>
                 </div>
                   </Link>
                )
            })
        }

        </div>



     </Slide>
  )
}

export default Celebs;
