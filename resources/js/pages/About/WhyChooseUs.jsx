import { FaCheckCircle } from "react-icons/fa";
import fundingImage from '../../components/images/professional/men_with_laptop.jpeg';
import assetsImage from '../../components/images/professional/people_on_suit.jpeg';

export default function WhyChooseUs() {
  return (
    <section className="md:pt-2 md:pb-40 bg-white text-gray-800">
      <div className="relative max-w-7xl mx-auto px-4">
        {/* Top text section */}
        <div className="mb-14 text-center md:text-left mt-8">
          <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-2 font-inter">
            Why Choose Optivest?
          </p>

          <div className="flex flex-wrap gap-16">
            <div className="space-y-4">
              <h3 className="text-4xl font-semibold font-inter">Security</h3>
              <h3 className="text-4xl font-semibold font-inter">Returns</h3>
              <h3 className="text-4xl font-semibold font-inter">Flexibility</h3>
            </div>
            <p className="text-gray-600 text-base max-w-md pr-4 font-inter">
              With Optivest, your investments are not only secure but also structured to deliver steady growth. Enjoy tailored plans,
              flexible payouts, and expert-backed strategies to build your financial future confidently.
            </p>
          </div>
        </div>

        {/* Visuals section */}
        <div className="grid md:grid-cols-2 gap-10 items-start justify-between">
          {/* Secure & Seamless Funding */}
          <div className="pb-2 md:pb-8">
            <img
              src={fundingImage}
              alt="Funding process"
              className="w-full rounded-xl"
            />
            <h4 className="text-lg font-semibold pl-7 font-inter">Seamless & Secure Funding</h4>
            <p className="text-sm text-gray-600 pl-7 font-inter">
              Invest instantly using secure payment methods. From bank transfers to PayPal, our platform ensures that your funds are safe and transactions are swift.
            </p>
          </div>

          {/* Diverse Investment Options */}
          <div className="space-y-2 md:space-y-4">
            <img
              src={assetsImage}
              alt="Investment plans"
              className="w-full rounded-xl pt-6"
            />
            <h4 className="text-lg font-semibold font-inter">Diverse Investment Opportunities</h4>
            <p className="text-sm text-gray-600 font-inter">
              Choose from a range of professionally curated investment plans tailored for different goals and risk levels.
              Whether you’re just starting or scaling up, there’s a perfect option for you.
            </p>
          </div>
        </div>

        {/* Trust and Security Section */}
        <div className="mt-20">
          <h3 className="text-2xl font-semibold text-[#4E40D9] mb-6 font-inter">Trust & Security</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm font-inter">
            <li className="flex items-center gap-3">
              <FaCheckCircle className="text-green-500" /> SSL-grade encryption to protect your data and transactions
            </li>
            <li className="flex items-center gap-3">
              <FaCheckCircle className="text-green-500" /> Expert portfolio management by licensed professionals
            </li>
            <li className="flex items-center gap-3">
              <FaCheckCircle className="text-green-500" /> Trusted by thousands of investors across regions
            </li>
            <li className="flex items-center gap-3">
              <FaCheckCircle className="text-green-500" /> Clear and consistent ROI tracking & payout system
            </li>
            <li className="flex items-center gap-3">
              <FaCheckCircle className="text-green-500" /> Fully compliant with financial regulatory standards
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
