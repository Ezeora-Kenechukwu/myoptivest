import React from 'react'
import { GoStar } from "react-icons/go";
import { FcGallery } from "react-icons/fc";
import { ImProfile } from "react-icons/im";
import { FaProjectDiagram } from "react-icons/fa";

const obi = [ 
    { 
        id:1,
        icon:"/CelebImg/Icon4.png",
        details:"Celebrity gossip is the behind-the-scenes buzz about the personal lives, relationships, drama, and daily happenings of famous personalities — from actors and musicians to influencers and reality stars. It’s the spicy mix of rumors, fashion faux pas, public feuds, surprise romances, and viral moments that fans love to follow."
    },
    { 
        id:2,
        icon:"/CelebImg/Icon2.png",
        details:"Step into the spotlight with our Photo Gallery — your visual gateway to the world of celebrities. From stunning red carpet looks and behind-the-scenes moments to throwback gems and candid snapshots, this is where every image tells a story."
    },
    { 
        id:3,
        icon:"/CelebImg/Icon3.png",
        details:"Get to know your favorite stars beyond the spotlight. Our Celebrity Profiles offer a deep dive into the lives, careers, and journeys of the biggest names in entertainment. From early beginnings to breakthrough moments and personal milestones — it’s all here."
    },
    { 
        id:4,
        icon:"/CelebImg/Icon1.png",
        details:"Stay ahead of the buzz with our Upcoming Projects section — your exclusive sneak peek into what your favorite celebrities are working on next. From blockbuster films and album drops to brand collabs and tour announcements, this is where future hits take the stage first."
    }
];

const SecondLayer = () => {
  return (
    <>
    
    <section className="w-full min-h-screen bg-orange-700 z-20 relative"> 
        <article className=" max-w-screen max-h-fit gap-12 justify-center px-10 md:px-10 md:py-20 lg:px-5 flex flex-wrap">
        <article className=" grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-14 mt-10 mb-10 ">
        { 
            obi.map(({id, icon, details}) => { 
               return( 
                <div className=" w-fit h-full  relative" key={id}> 
                <div className="icon  absolute bg-amber-500 -top-8 left-[calc(50%-32px)] flex items-center justify-center w-16 h-16 border-4 border-white rounded-full"><img src={icon} alt={icon} className='w-10 h-10'/></div>
                <div className="details h-full bg-white  rounded-md max-w-[250px] py-3  px-4">
                   <p className="text-xs text-center mt-4 p-4 md:py-8">{details}</p>
                </div>
               </div>
               )
            })
        }
    </article>
         <div className="what justify-center md:py-20">
         <div className="relative  w-full  border-b-2 border-slate-300 max-w-[500px] mx-auto mt-6 mb-6">
            <h4 className='text-white text-sm font-amarante -top-3 bg-orange-700 left-[calc(50%-75px)] z-20 absolute text-center min-w-[150px]'>What We Are<b className='text-yellow-400'> Offering</b></h4>
            </div>
            <h4 className='text-center text-2xl md:text-3xl lg:text-4xl text-white max-w-[350px] font-sans '><b className='text-yellow-500'>Services</b> We Can Offer!!</h4>
            <p className='max-w-[400px] mt-5 text-white mb-5'>At Celebrity Hub, we offer a range of services designed to bring fans and fame even closer together. From curated celebrity profiles and exclusive media coverage to fan engagement tools, digital promotions, and brand collaborations — we’re your go-to source for all things star-powered.</p>
         </div>
        </article>
       </section>
       </>
  )
}

export default SecondLayer