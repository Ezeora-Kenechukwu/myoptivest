import dashboardImage from '../../components/images/Dashboard (1) 1.png';
import { PiStarFourFill } from "react-icons/pi";

export default function AboutBanner() {
  return (
    <section className="relative pt-28 pb-2 md:pb-4 bg-gradient-to-b from-[#4E40D9] to-[#6E21C5A1] text-white">
      <div className="max-w-7xl mx-auto px-4 pt-28 text-center">
        {/* Badge */}
        <div className="text-sm text-white/80 font-medium mb-3 flex justify-center items-center gap-2">
          <PiStarFourFill className="text-yellow-400" />
          <p className='font-inter'>Empowering lives through smart finance</p>
          <PiStarFourFill className="text-yellow-400" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold font-inter leading-tight mb-4">
          Your Trusted Partner for Smart <br />
          Investment & Loan Solutions
        </h1>

        {/* Subtext */}
        <p className="max-w-2xl mx-auto text-[#F5F5F5] text-base sm:text-[20px] font-inter">
          Discover a platform built for growth and support, from flexible loans to insightful investment tools, we empower individuals and businesses to achieve their financial goals with confidence.
        </p>
      </div>

      {/* Dashboard Image */}
      {/* <div className="flex justify-center md:absolute md:top-[568px] mx-[175px]">
        <img
          src={dashboardImage}
          alt="About us preview"
          className="w-[200px] h-[200px] md:w-full max-w-7xl md:h-full md:max-h-[780px] shadow-lg rounded-2xl border-8 md:border-20 border-white"
        />
      </div> */}
    </section>
  );
}
