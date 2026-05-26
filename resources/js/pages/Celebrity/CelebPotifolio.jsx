import React from 'react'
import WelcomeLayout from '@/layouts/welcome-layout';
import { Link } from '@inertiajs/react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { ImWhatsapp } from "react-icons/im";
import { FaPaperPlane } from "react-icons/fa6";
import { ImFacebook } from "react-icons/im";
import { FaSquarePhone } from "react-icons/fa6";



const CelebPotifolio = ({celebrity}) => {
    console.log('====================================');
    console.log(celebrity);
    console.log('====================================');
  return (
   <WelcomeLayout>
      <section className="w-full pt-[120px] min-h-screen  mb-5  max-w-5xl mx-auto">
        <article className="flex gap-x-40 gap-5 flex-wrap px-10 mb-8 justify-center">
        <div className="w-fit">
        <h4 className='font-concert mb-3 font-bold text-xl md:text-2xl lg:text-4xl'>{celebrity.name}</h4>
        {celebrity.social_links.map(({ link, title }) => {
  let Icon = null;

  if (title.toLowerCase() === "facebook") {
    Icon = ImFacebook;
  } else if (title.toLowerCase() === "Whatsapp") {
    Icon = ImWhatsapp;
  } else if (title.toLowerCase() === "Telegram") {
    Icon = FaPaperPlane;
  }

  return (
    <Link
      href={link}
      key={title}
      className="max-w-[400px] font-mono text-sm md:text-xl flex items-center gap-2"
      target="_blank"
      rel="noopener noreferrer"
    >
      {Icon && <Icon />}
     {title}
    </Link>
  );
})}
        <p className="">Booking Amount: {celebrity.booking_amount}</p>
        <p className='font-serif text-sm md:text-xl lg:text-2xl'>{celebrity.category.name}</p>
        <Link href='/reservations/create' className='bg-orange-500 text-white font-light text-xs w-fit rounded-xl px-4 py-3 border-b-4 border-orange-700 mt-5 block'>Book Now!</Link>
        </div>
        <div className="img  h-[150px] w-[150px] rounded-full "><img src={`/storage/${celebrity.thumbnail}`} alt="Celebrity Icon" className='rounded-full w-full h-full'/></div>
        </article>
        <h4 className='text-center mb-4 font-extrabold font-amarante text-orange-700 max-w-4xl text-2xl md:text-3xl lg:text-5xl'>Biography</h4>
        <article className="flex gap-x-40 gap-5 flex-wrap px-10 justify-center">
           <div className="main w-fit">
          <div className="carouselCont max-w-3xl mx-auto rounded-md">
          <Carousel autoPlay={true} autoFocus={true} infiniteLoop={true} emulateTouch={true} showArrows={false} showIndicators={false} showThumbs={false} stopOnHover={true}  dynamicHeight={false}  swipeable={true} useKeyboardArrows={true}>

            {
                celebrity.photo.map((src) => {
                   return(
                   <div className="">
                     <img src={`/storage/${src}`} className="h-400px] w-full  rounded-xl border-4" key={src} />
                   </div>
                   )
                })
            }

           </Carousel>
          </div>

            <div className="">
               {/* Bio */}
            <div
              className="prose max-w-none prose-p:leading-relaxed prose-headings:text-gray-800 mt-10"
              dangerouslySetInnerHTML={{ __html: celebrity.bio }}
            />
               <Link href='/reservations/create' className='bg-orange-500 text-white font-light text-xs w-fit rounded-xl px-4 py-3 border-b-4 border-orange-700 mt-5 mb-2 block '>Book Now!</Link>
            </div>
           </div>
        </article>
    </section>
   </WelcomeLayout>
  )
}

export default CelebPotifolio;
