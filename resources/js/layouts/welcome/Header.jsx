import { useState } from 'react';
import { FiMenu } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { Link } from '@inertiajs/react';
import logo from '../../icons/optivest_logo.svg';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[#F6F4F9] shadow-sm fixed top-0 w-full z-50 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <img src={logo} alt="Optivest Logo" className="h-[52px] w-[159px]" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 items-center text-gray-700 font-inter">
          <Link href="/" className="text-[#2A2A2A] hover:text-purple-600 transition font-normal font-inter text-xl" >Home</Link>
          <Link href="/about" className="text-[#2A2A2A] hover:text-purple-600 transition font-normal font-inter text-xl">About Us</Link>
          <Link href="/invest-plans" className="text-[#2A2A2A] hover:text-purple-600 transition font-normal font-inter text-xl">Investment Plans</Link>
          <Link href="/terms" className="text-[#2A2A2A] hover:text-purple-600 transition font-normal font-inter  text-xl ">Terms of Use</Link>
          <Link href="/contact" className="text-[#2A2A2A] hover:text-purple-600 transition font-normal font-inter  text-xl ">Contact Us</Link>

        </nav>
        <div className="hidden md:flex">
            <Link
            href="/login"
            className=" px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition w-[194px] text-[17.69px] text-center "
          >
            Login
          </Link>
        </div>


        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-700"
        >
          {mobileMenuOpen ? <IoMdClose className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 pt-2 pb-4 space-y-3 font-medium text-gray-700">
          <Link href="/" className="block text-black hover:text-purple-600 font-inter">Home</Link>
          <Link href="/about" className="block text-black hover:text-purple-600 font-inter">About Us</Link>
          <Link href="/invest-plans" className="block text-black hover:text-purple-600 font-inter">Investment Plans</Link>
          <Link href="/terms" className="block text-black hover:text-purple-600 font-inter">Terms of Use</Link>
          <Link href="/contact" className="block text-black hover:text-purple-600 font-inter">Contact Us</Link>
          <Link
            href="/login"
            className="block text-center font-inter mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Login
          </Link>
        </div>
      )}
    </header>
  );
}
