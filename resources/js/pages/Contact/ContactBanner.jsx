import React from "react";
import { PiStarFourFill } from "react-icons/pi";

const ContactBanner = () => {
  return (
    <section className="relative pt-28 pb-2 md:pb-16 bg-gradient-to-b from-[#4E40D9] to-[#6E21C5A1] text-white">
      <div className="max-w-7xl mx-auto px-4 pt-14 text-center">
        {/* Badge */}
        <div className="text-sm text-white/80 font-medium mb-3 flex justify-center items-center gap-2">
          <PiStarFourFill className="text-yellow-400" />
          <p className="font-inter">We are Here to Help</p>
          <PiStarFourFill className="text-yellow-400" />
        </div>

        {/* Page Heading */}
        <h1 className="text-3xl md:text-5xl font-bold font-inter text-gray-100">
          Contact Us
        </h1>
        <p className="text-gray-100 max-w-2xl mx-auto mt-4 font-inter">
          Have questions about your investments, loans, or our services?
          Our dedicated support team is ready to provide the answers, guidance,
          and clarity you need to make confident financial decisions.
        </p>
      </div>
    </section>
  );
};

export default ContactBanner;
