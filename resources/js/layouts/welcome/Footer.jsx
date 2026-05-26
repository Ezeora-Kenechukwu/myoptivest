import React from 'react';
import { Link } from '@inertiajs/react';
import { FaRegCopyright } from "react-icons/fa6";
import logo from '../../icons/optivest_logo.svg';

const Footer = () => {
  return (
    <footer className='py-3 bg-white text-[#6D6D6D] w-full'>
      <section className="flex flex-wrap justify-between my-10 gap-10 items-center px-5">
        <article className="flex justify-evenly w-full mx-12">
          {/* Logo & Tagline */}
          <div className="pr-10 flex-1">
            <img src={logo} alt="Optivest Logo" className="mb-4" />
            <p className="text-sm max-w-xs">
              Optivest is your trusted platform for smarter investments.
              We combine expert insights, advanced tools, and a commitment to transparency to help you grow your wealth with confidence.
            </p>
          </div>

          {/* Footer Links */}
          <div className="flex flex-1 gap-10 flex-wrap justify-between">

            {/* Product */}
            <div>
              <h4 className="mb-8 font-bold text-[#4E40D9]">Product</h4>
              <ul className='flex gap-3 flex-col'>
                <Link href='/' className='text-lg hover:text-[#4E40D9] transition'>Investment Plans</Link>
                <Link href='/' className='text-lg hover:text-[#4E40D9] transition'>Advisory Services</Link>
                <Link href='/' className='text-lg hover:text-[#4E40D9] transition'>Financial Tools</Link>
                <Link href='/' className='text-lg hover:text-[#4E40D9] transition'>Security & Compliance</Link>
                <Link href='/' className='text-lg hover:text-[#4E40D9] transition'>Loans</Link>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="mb-8 font-bold text-[#4E40D9]">Company</h4>
              <ul className='flex gap-3 flex-col'>
                <Link href='/about' className='text-lg hover:text-[#4E40D9] transition'>About Us</Link>
                <Link href='/' className='text-lg hover:text-[#4E40D9] transition'>News & Updates</Link>
                <Link href='/' className='text-lg hover:text-[#4E40D9] transition'>Our Partners</Link>
                <Link href='/' className='text-lg hover:text-[#4E40D9] transition'>Careers</Link>
                <Link href='/contact' className='text-lg hover:text-[#4E40D9] transition'>Contact Us</Link>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="mb-8 font-bold text-[#4E40D9]">Resources</h4>
              <ul className='flex gap-3 flex-col'>
                <Link href='/' className='text-lg hover:text-[#4E40D9] transition'>Blog</Link>
                <Link href='/' className='text-lg hover:text-[#4E40D9] transition'>Pricing</Link>
                <Link href='/' className='text-lg hover:text-[#4E40D9] transition'>FAQ</Link>
                <Link href='/' className='text-lg hover:text-[#4E40D9] transition'>Events</Link>
                <Link href='/' className='text-lg hover:text-[#4E40D9] transition'>Ebooks & Guides</Link>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="mb-8 font-bold text-[#4E40D9]">Follow Us</h4>
              <div className="flex flex-col gap-3">
                <a href="https://linkedin.com" className="hover:text-[#4E40D9] transition">LinkedIn</a>
                <a href="https://twitter.com" className="hover:text-[#4E40D9] transition">Twitter</a>
                <a href="https://instagram.com" className="hover:text-[#4E40D9] transition">Instagram</a>
                <a href="https://facebook.com" className="hover:text-[#4E40D9] transition">Facebook</a>
                <a href="https://youtube.com" className="hover:text-[#4E40D9] transition">YouTube</a>
              </div>
            </div>
          </div>
        </article>
      </section>

      {/* Divider */}
      <div className="border-b w-full border-gray-300"></div>

      {/* Bottom Section */}
      <section className="cont">
        <article className='flex px-4 gap-10 flex-wrap lg:justify-between py-5 justify-center'>
          <div className="flex gap-5 flex-wrap px-10">
            <Link href='/terms' className='text-xs hover:text-[#4E40D9] transition'>Terms & Conditions</Link>
            <Link href='/' className='text-xs hover:text-[#4E40D9] transition'>Privacy Policy</Link>
            <Link href='/' className='text-xs hover:text-[#4E40D9] transition'>Cookies Policy</Link>
          </div>
          <div className="mt-0 py-2 flex items-center gap-2">
            <FaRegCopyright size={15} />
            <p className='text-sm'>2020-2025 Optivest - All Rights Reserved</p>
          </div>
        </article>
      </section>
    </footer>
  )
}

export default Footer;
