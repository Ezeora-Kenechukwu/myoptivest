import React from 'react'
import { Link } from '@inertiajs/react';

const FaqsBanner = () => {
  return (
    <section className="w-full min-h-fit bg-no-repeat bg-cover bg-[url(/CelebImg/Banna2.png)]">
    <article className='bg-[rgba(0,0,0,0.8)]  place-items-center relative flex flex-col items-center justify-center min-h-screen'>
     <h5 className='text-white mb-6'>Welcome To <b className='text-orange-500'>Celebrity Hub</b></h5>
    <h4 className='text-2xl sm:text-3xl lg:text-5xl text-center font-bubbles  text-white max-w-[500px] sm:max-w-[800px]lg:max-w-[900px]'>Where Fans Become <b className='border-b-2 border-b-orange-500'> Insiders</b></h4>
    <p className="text-white text-sm mt-10 text-center max-w-[300px] sm:max-w-[400px] lg:max-w-[500px]">Obsessed with celeb life?  So are we.
    Join the community that lives and breathes fame.</p>
    <Link href="/register" className='block rounded-2xl text-white font-amarante bg-orange-500 w-fit py-4 sm:py-4 px-2 mt-4'>Get Started!</Link>
    </article>
   </section>
  )
}

export default FaqsBanner