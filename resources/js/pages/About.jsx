import React from 'react'
import WelcomeLayout from '@/layouts/welcome-layout';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { Head, Link } from '@inertiajs/react'
import AboutBanner from "./About/AboutBanner";
import FirstLayer from './About/FirstLayer';
import SecondLayer from './About/SecondLayer';
import Banner from './HomeComponents/Banner';
import WhyChooseUs from './About/WhyChooseUs';
import MissionVisionValues from './About/MissionVissionValues';

// const about = [
//     {
//         id:1,
//         img:"/CelebImg/Angelina Jolie.jpeg"
//     },
//     {
//         id:2,
//         img:"/CelebImg/Carousel1.jpeg"
//     },
//     {
//         id:3,
//         img:"/CelebImg/Carousel3.jpeg"
//     },
//     {
//         id:4,
//         img:"/CelebImg/Carousel4.jpeg"
//     },
//     {
//         id:5,
//         img:"/CelebImg/DuaLipa.jpeg"
//     },
//     {
//         id:6,
//         img:"/CelebImg/RiRi.jpeg"
//     },
//     {
//         id:7,
//         img:"/CelebImg/vectors.jpeg"
//     }
// ]
const About = () => {
  return (
    <WelcomeLayout>
        <Head title="About Us" />
        {/* <Banner/> */}
  <AboutBanner />
   {/* <FirstLayer /> */}

   <MissionVisionValues />
   <WhyChooseUs />
   {/* <SecondLayer /> */}
    </WelcomeLayout>
  )
}

export default About;
