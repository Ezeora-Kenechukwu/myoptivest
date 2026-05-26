import React from "react";
import WelcomeLayout from "@/layouts/welcome-layout";
import { PiStarFourFill } from "react-icons/pi";
import { Head } from "@inertiajs/react";

const Terms = () => {
  return (
    <WelcomeLayout>
      <Head title="Terms of Use" />
      <section className="bg-gray-50">

        {/* Hero Section */}
        <section className="relative pt-28 pb-2 md:pb-16 bg-gradient-to-b from-[#4E40D9] to-[#6E21C5A1] text-white">
          <div className="max-w-7xl mx-auto px-4 pt-14 text-center">
            {/* Badge */}
            <div className="text-sm text-white/80 font-medium mb-3 flex justify-center items-center gap-2">
              <PiStarFourFill className="text-yellow-400" />
              <p className="font-inter">Our Commitment to Transparency</p>
              <PiStarFourFill className="text-yellow-400" />
            </div>

            {/* Page Heading */}
            <h1 className="text-3xl md:text-5xl font-bold font-inter text-gray-100">
              Terms of Use
            </h1>
            <p className="text-gray-100 max-w-2xl mx-auto mt-4 font-inter">
              These Terms outline the standards, responsibilities, and principles
              that guide your journey with Optivest. By using our services, you
              agree to these terms and commit to responsible investing.
            </p>
          </div>
        </section>

        {/* Terms Content */}
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">

          {/* Section 1 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300">
            <h2 className="text-2xl font-semibold text-[#4E40D9] mb-3 font-inter">
              1. Agreement to Our Terms
            </h2>
            <p className="text-gray-700 font-inter leading-relaxed">
              By creating an account or engaging in our investment or loan
              programs, you acknowledge and agree to follow these Terms of Use,
              our Privacy Policy, and applicable laws. If you do not agree,
              please refrain from using our services.
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300">
            <h2 className="text-2xl font-semibold text-[#4E40D9] mb-3 font-inter">
              2. Eligibility
            </h2>
            <p className="text-gray-700 font-inter leading-relaxed">
              You must be at least{" "}
              <span className="text-green-600 font-medium">18 years old</span>{" "}
              and legally capable of entering into binding agreements to use
              Optivest’s platform. This ensures all members can make informed,
              responsible financial decisions.
            </p>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300">
            <h2 className="text-2xl font-semibold text-[#4E40D9] mb-3 font-inter">
              3. Investment Guidelines & Disclaimers
            </h2>
            <p className="text-gray-700 font-inter leading-relaxed">
              All investments are subject to market conditions and performance
              changes over time. While Optivest focuses on secure, well-researched
              opportunities, returns can be influenced by external factors
              beyond our control. We encourage diversification and informed
              decision-making to help you achieve long-term stability and growth.
            </p>
          </div>

          {/* Section 4 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300">
            <h2 className="text-2xl font-semibold text-[#4E40D9] mb-3 font-inter">
              4. Responsible Use of Our Platform
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 font-inter">
              <li>Only use the platform for lawful and authorized purposes.</li>
              <li>Provide accurate, up-to-date information at all times.</li>
              <li>Respect our security measures and data protection policies.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300">
            <h2 className="text-2xl font-semibold text-[#4E40D9] mb-3 font-inter">
              5. Updates to These Terms
            </h2>
            <p className="text-gray-700 font-inter leading-relaxed">
              We may update these Terms from time to time to reflect changes in
              our services, regulations, or market conditions. Continued use of
              Optivest after any updates will signify your acceptance of the
              revised Terms.
            </p>
          </div>
        </div>

      </section>
    </WelcomeLayout>
  );
};

export default Terms;
