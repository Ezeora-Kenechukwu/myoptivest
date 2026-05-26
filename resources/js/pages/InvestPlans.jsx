import React from "react";
import WelcomeLayout from "@/layouts/welcome-layout";
import { FaClock, FaMoneyBillWave, FaPercent, FaCalendarCheck } from "react-icons/fa";
import { PiStarFourFill } from "react-icons/pi";
import { Head, Link } from "@inertiajs/react";



const InvestPlans = ({ plans }) => {

  return (
    <WelcomeLayout>
        <Head title="Investment Plans" />
      <section className="bg-gray-50 py-16">
        <section className="relative pt-28 pb-2 md:pb-16 bg-gradient-to-b from-[#4E40D9] to-[#6E21C5A1] text-white">
              <div className="max-w-7xl mx-auto px-4 pt-14 text-center">
                {/* Badge */}
                <div className="text-sm text-white/80 font-medium mb-3 flex justify-center items-center gap-2">
                  <PiStarFourFill className="text-yellow-400" />
                  <p className='font-inter'>Trusted by over 10,000 users</p>
                  <PiStarFourFill className="text-yellow-400" />
                </div>

                {/* Page Heading */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold font-inter text-gray-100">
              Investment Plans
            </h1>
            <p className="text-gray-100 max-w-2xl mx-auto mt-4 font-inter">
              Choose from our professionally curated investment opportunities, each
              tailored for growth, security, and consistent returns.
            </p>
          </div>
              </div>
            </section>
        <div className="max-w-7xl mx-auto px-4 pt-8">
            <h1 className="text-2xl md:text-4xl font-bold font-inter text-gray-800 py-4">
              Investment Plans
            </h1>

          {/* Plans Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 flex flex-col"
              >

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-semibold text-[#4E40D9] font-inter text-center mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 font-inter">
                    {plan.short_description}
                  </p>

                  {/* Stats */}
                  <div className="space-y-2 mb-4 text-sm font-inter">
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaPercent className="text-[#4E40D9]" /> ROI:{" "}
                      <span className="font-semibold">{plan.roi}%</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaMoneyBillWave className="text-[#4E40D9]" /> Investment Amount:{" "}
                      <span className="font-semibold">
                        ₦{plan.min_amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaClock className="text-[#4E40D9]" /> Duration:{" "}
                      <span className="font-semibold">
                        {Math.floor(plan.duration / 730)} months
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaCalendarCheck className="text-[#4E40D9]" /> Payout:{" "}
                      <span className="font-semibold capitalize">
                        {plan.payout_frequency}
                      </span>
                    </div>
                  </div>

                  {/* Long description */}
                  <div
                    className="text-gray-600 text-sm mb-4 font-inter"
                    dangerouslySetInnerHTML={{ __html: plan.long_description }}
                  />

                  {/* Category */}
                  {plan.category && (
                    <p className="text-xs text-gray-500 italic mb-4">
                      Category: {plan.category.name}
                    </p>
                  )}

                  {/* Call to action */}
                  <Link href="/register" className="mt-auto bg-[#4E40D9] text-white text-center py-2 px-4 rounded-lg font-inter font-medium hover:bg-[#3a2fb5] transition">
                    Invest Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </WelcomeLayout>
  );
};

export default InvestPlans;
