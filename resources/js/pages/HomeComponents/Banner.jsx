import dashboardImage from '../../components/images/Dashboard (1) 1.png';
import { PiStarFourFill } from "react-icons/pi";

export default function Banner() {
  return (
    <section className="relative h-screen pt-28 pb-2 md:pb-16 bg-gradient-to-b from-[#4E40D9] to-[#6E21C5A1] text-white">
      <div className="max-w-7xl mx-auto px-4 pt-28 text-center">
        {/* Badge */}
        <div className="text-sm text-white/80 font-medium mb-3 flex justify-center items-center gap-2">
          <PiStarFourFill className="text-yellow-400" />
          <p className='font-inter'>Trusted by over 10,000 users</p>
          <PiStarFourFill className="text-yellow-400" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold font-inter leading-tight mb-4">
          Take Control of Your Financial Future <br />
          with Smarter, Simpler Investing
        </h1>

        {/* Subtext */}
        <p className="max-w-2xl mx-auto text-[#F5F5F5] text-base sm:text-[20px] mb-10 font-inter">
          Whether you're just starting out or building your portfolio, our expert tools and insights help you grow your wealth with confidence, clarity, and control.
        </p>


      </div>
              {/* Dashboard Image */}
        <div className="flex justify-center md:absolute md:top-[568px] mx-[175px]">
          <img
            src={dashboardImage}
            alt="Dashboard preview"
            className="w-[200px] h-[200px] md:w-full max-w-7xl md:h-full md:max-h-[780px] shadow-lg rounded-2xl border-8 md:border-20 border-white"
          />
        </div>
    </section>
  );
}
