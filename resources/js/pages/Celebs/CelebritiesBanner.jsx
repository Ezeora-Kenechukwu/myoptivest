import React from 'react';
import { Link } from '@inertiajs/react';

const CelebritiesBanner = ({setFilteredCategory, filteredCategory, celebrities}) => {
  return (
    <section className="w-full min-h-fit bg-no-repeat bg-cover bg-[url(/CelebImg/fantasy-galaxy.jpg)]">
    <article className='bg-[rgba(0,0,0,0.8)]  place-items-center relative flex flex-col items-center justify-center min-h-screen'>
     <h5 className='text-white mb-6'>Welcome To <b className='text-orange-500'>Celebrity Hub</b></h5>
    <h4 className='text-2xl sm:text-3xl lg:text-5xl text-center font-bubbles  text-white max-w-[500px] sm:max-w-[800px]lg:max-w-[900px]'>The Culture Starts <b className='border-b-2 border-b-orange-500'>  Here</b></h4>
    <p className="text-white text-sm mt-10 text-center max-w-[300px] sm:max-w-[400px] lg:max-w-[500px]">Breaking news, viral trends, fashion heat — all curated for the ultimate fan.</p>
    <form action="">
    <input
  type="search"
  name="search"
  id="search"
  placeholder="Search"
  className="block rounded-2xl text-white font-amarante bg-orange-500 w-80 py-4 sm:py-4 px-2 mt-4"
  onChange={(e) => {
    const searchValue = e.target.value.trim();
    const regex = new RegExp(searchValue, 'i'); // case-insensitive search

    const filtered = celebrities.filter(item => {
      return (
        regex.test(item.bio) ||
        regex.test(item.name) ||
        regex.test(item.category?.name)
      );
    });

    // You probably want to update state here, like:
    setFilteredCategory(filtered); // Make sure you have a useState for this
  }}
/>

    </form>
    </article>
   </section>
  )
}
export default CelebritiesBanner;
