import setupImage from '../../components/images/Account Setup.png';

export default function Workings() {
  return (
    <section className="bg-[#4E40D9] mt-24 md:mt-56 py-20 text-white">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center ">

        {/* Left - Image */}
        <div className="flex justify-center">
          <img
            src={setupImage}
            alt="Account Setup"
            className="w-full max-w-[759px] object-contain"
          />
        </div>

        {/* Right - Text and Steps */}
        <div>
          <p className="text-sm uppercase tracking-wide text-white/70 mb-2 font-sans">How it works</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-sans">Few Easy Steps and Done</h2>
          <p className="text-white/90 mb-6 leading-relaxed font-sans">
            lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
            lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
          </p>

          {/* Step Box */}
          <div className="bg-[#334077] w-fit md:w-[526px] rounded-lg p-6 space-y-6">
            {[1, 2, 3].map((step, i) => (
              <div key={step} className="flex items-start gap-4 relative">
                {/* Vertical Line */}
                {i < 1 && (
                  <span className="absolute left-6 top-8 h-full w-px bg-[#3C57C4]"></span>
                )}
                {i < 2 && (
                  <span className="absolute left-6 top-8 h-full w-px  border-b-4 border-b-dashed border-b-[#3C57C4] bg-[#3C57C4]"></span>
                )}

                {/* Circle Number */}
                <div className={`h-12 w-12 flex items-center justify-center rounded-full font-bold text-[#FFFFFF] ${
                  step === 3 ? 'bg-[#FFFFFF] text-black' : 'bg-[#3C57C4] text-[#FFFFFF]'
                }`}>
                  {step}
                </div>

                {/* Step Text */}
                <p className="text-sm font-sans">
                  {step === 1 && 'Register your account.'}
                  {step === 2 && 'Fill in your details'}
                  {step === 3 && 'Done, let’s continue the work.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
