import fundingImage from '../../components/images/Fund optivest asset.png';
import assetsImage from '../../components/images/Dashboard (1) 1.png';

export default function WhyUseOptivest() {
  return (
    <section className="md:pt-40  md:pb-40 bg-white text-gray-800">
      <div className="relative top-4 md:top-[400px] max-w-7xl mx-auto px-4">
        {/* Top text section */}
        <div className="mb-14 text-center md:text-left mt-16 pt-16">
          <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-2 pt-4 font-inter">
            Why Use Optivest?
          </p>

          <div className="flex flex-wrap gap-16 ">
            <div className="space-y-4">
              <h3 className="text-4xl font-semibold font-inter">Growth</h3>
              <h3 className="text-4xl font-semibold font-inter">Diversification</h3>
              <h3 className="text-4xl font-semibold font-inter">Income</h3>
            </div>
            <p className="text-gray-600 text-base max-w-md pr-4 font-inter">
              Investing helps your money grow through compounding returns,
              turning small contributions today into significant wealth in the future.
            </p>
          </div>
        </div>

        {/* Visuals section */}
        <div className="grid md:grid-cols-2 gap-10 items-start justify-between">
          {/* Funding Made Easy Block */}
          <div className="pb-2 md:pb-8 ">
            <img
              src={fundingImage}
              alt="Funding form"
              className="w-full rounded-xl "
            />
            <h4 className="text-lg font-semibold pl-7 font-inter">Funding Made Easy</h4>
            <p className="text-sm text-gray-600 pl-7 font-inter">
              Seamless payments made easy — instantly invest using secure Bank Transfers or PayPal with just a few clicks.
            </p>
          </div>

          {/* Opti Assets Block */}
          <div className="space-y-2 md:space-y-4">
            <img
              src={assetsImage}
              alt="Opti assets table"
              className="w-full rounded-xl pt-6"
            />
            <h4 className="text-lg font-semibold font-inter">Opti Assets</h4>
            <p className="text-sm text-gray-600 font-inter">
             lorem ispum lorem ispum lorem ispum lorem ispum  orem ispum lorem ispum lorem ispum lorem ispum lorem ispum lorem ispum  orem ispum lorem ispum
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
