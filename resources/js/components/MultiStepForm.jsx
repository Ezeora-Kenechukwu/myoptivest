import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";


const MultiStepForm = ({steps, submit}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const goNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const goPrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const progressWidth = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2
          className="text-[#0A0A0C] font-rubik font-semibold text-[24px] leading-[100%] tracking-[1%]"
        >
          {steps[currentStep].title}
        </h2>
        <span className="text-[#0A0A0C] font-rubik font-semibold text-[24px] leading-[100%] tracking-[1%]">
          {currentStep + 1}/{steps.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#E9E9E9] h-[10px] rounded-full overflow-hidden">
        <div
          className="bg-[#4D42DB] h-full transition-all duration-500"
          style={{ width: `${progressWidth}%` }}
        ></div>
      </div>

      {/* Back Arrow */}
      {currentStep > 0 && (
        <button
          onClick={goPrev}
          className="flex items-center text-[#2a2a2b] gap-2 cursor-pointer"
        >
          <IoIosArrowRoundBack size={40} />
          {/* <span className="font-medium">Back</span> */}
        </button>
      )}

      {/* Form Content */}
      <div className="mt-4">
        {steps[currentStep].content}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6 ">
        {currentStep > 0 && (
          <button
            onClick={goPrev}
            className="bg-[#4D42DB] text-white w-[123px] h-[48px] rounded-[24px] px-[44px] py-[10px] text-sm"
          >
            Previous
          </button>
        )}

        {currentStep < steps.length - 1 ? (
          <button
            onClick={goNext}
            className="bg-[#4D42DB] text-white w-[123px] h-[48px] rounded-[24px] px-[44px] py-[10px] text-sm ml-auto"
          >
            Next
          </button>
        ) : (
          <button
            className="bg-[#4D42DB] text-white w-[123px] h-[48px] rounded-[24px] px-[44px] py-[10px] text-sm ml-auto"
            onClick={submit}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default MultiStepForm;
