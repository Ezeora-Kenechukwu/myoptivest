import React from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

const banner = [
    {
id:1,
title:'WELCOME TO YOUR WORLD OF FAVORITE CELEBRITIES',
description:"Whether you’re here to learn more about your role model, stay updated on the buzz, or just explore the glittering world of fame — you're in the right place.",

    },
    {
id:2,
title:'EXPERIENCE THE GLAMOUR BEHIND THE GLOW',
description:"From fan to fam — get closer to the celebrities who inspire you, Get A Memory You'll never Forget.",

    },
    {
id:3,
title:'THE HUB OF FAME, FASHION & FAN MOMENTS',
description:"Welcome to Celebrity Hub — your front-row seat to the world of fame, inspiration, and entertainment"

    },
]
const Banner = () => {
  return (
    <div className="banner w-full h-[80vh]  md:min-h-screen     bg-no-repeat bg-cover bg-[url(/CelebImg/GroupCeleb.png)]">

    <Carousel autoPlay={true} autoFocus={true} infiniteLoop={true} emulateTouch={true} showArrows={false} showIndicators={false} showThumbs={false} stopOnHover={true} swipeable={true} useKeyboardArrows={true}>
    {
        banner.map(item => {
            return  <div className="info  text-center mt-4 flex min-h-screen items-center justify-center flex-col bg-[rgba(0,0,0,0.5)]" key={item.id}>
            <h5 className='text-4xl md:text-6xl font-bubbles lg:text-7xl max-w-4xl mx-auto text-white  font-stretch-50% font-semibold mb-5 uppercase'>{item.title}</h5>
            <p className='text-xl text-white font-amarante  max-w-4xl'>{item.description}</p>
          </div>
        })
    }
</Carousel>

    </div>
  )
}

export default Banner
