import React from 'react'

const FirstLayer = () => {
  return (
    <section className="w-full min-h-screen m-auto mt-5">
        <article className="flex flex-wrap ">
            <div className="relative max-h-fit m-auto w-fit place-items-center">
                <div className="relative  w-full  border-b-2 border-slate-300 max-w-[500px] mx-auto ">
                <h4 className='-top-3 bg-white left-[calc(50%-100px)] z-20 absolute text-center min-w-[200px] text-orange-500'>About <b className='text-slate-300'>Celebrity Hub</b></h4>
                </div>

                <div className="info mt-12">
                    <h4 className='font-amarante m-auto text-xl sm:text-3xl lg:text-4xl max-w-[200px] sm:max-w-[300px] lg:max-w-[600px]'>Introduction To <b className='text-orange-500'>Celebrity Hub</b></h4>
                    <p className='text-center justify-center text-xs md:text-md lg:text-lg mt-5 max-w-[300px]'>At Celebrity Hub, we’re passionate about celebrating the stars who inspire us — from A-list actors and chart-topping musicians to viral influencers and timeless icons. <br /> Whether you're a lifelong fan or a pop culture enthusiast, our platform is designed to bring you closer to the lives, journeys, and styles of your favorite celebrities. <br /> We are dedicated to bringing you th latest exclusive interviews, and in-dept coverage of your favorite stars.</p>
                </div>
            </div>
           <div className="sec2 px-8 mt-10">
          <div className="w-fit max-h-fit flex items-center  flex-col gap-4">
          <img src="/CelebImg/RihannaArt.png" alt="An Image" className='w-fit h-70 mt-4 rounded-md'/>
          <div className="w-[250px] h-[300px] -lg:ml-[80px] -lg:rotate-12 -mt-[50px] -lg:mt-[150px] p-2 bg-gradient-to-t from-55% from-[rgba(255,166,0,0.53)] to-white">
          <img src="/CelebImg/Carousel4.jpeg" alt="Am Image" className='w-full h-full'/>
          </div>
          </div>
           </div>
        </article>
       </section>
  )
}

export default FirstLayer
