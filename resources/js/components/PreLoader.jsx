import React, { useEffect } from 'react'
import { FaSpinner } from 'react-icons/fa'
// import loader1 from "/Gear.gif";
// import loader from "/spinner.gif";
import { useForm } from '@inertiajs/react';
const Preloader = ({settings}) => {

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
        isTablet:false,
        isDesktop: false,
        isMobile:false,
    });

    // const getInnerWidth = () => {
    //     const innerww = window.innerWidth;
    //     if (innerww >= 1024) {
    //       setData({ isTablet: false, isDesktop: true, isMobile: false });
    //     } else if (innerww >= 640 && innerww < 1024) {
    //       setData({ isTablet: true, isDesktop: false, isMobile: false });
    //     } else {
    //       setData({ isTablet: false, isDesktop: false, isMobile: true });
    //     }
    //   };

    //   useEffect(() => {
    //     getInnerWidth(); // Initial call to set the data based on the current width
    //     window.addEventListener('resize', getInnerWidth);

    //     return () => {
    //       window.removeEventListener('resize', getInnerWidth);
    //     };
    //   }, []);
  return (
    <div className={`overflow-hidden duration-700 w-full h-full bg-opacity-90   fixed top-0 bottom-0 bg-no-repeat bg-cover bg-fixed left-0  z-[9999999] flex justify-center items-center bg-[rgba(255,255,255,0.4)]`}>


        <div className="  ">
            <FaSpinner size={40} className='animate-spin' />
        </div>
            </div>
  )
}

export default Preloader
// [rgba(91,90,107,0.9)]
