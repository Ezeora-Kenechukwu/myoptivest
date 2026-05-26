import { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    name: "Sarah Williams",
    heading: "It’s just incredible!",
    title: "Investor",
    message:
      "Optivest transformed my savings. The platform is intuitive, and I feel more confident about my financial future.",
    avatar: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: 2,
    name: "James Okoro",
    heading: "Satisfied User Here!",
    title: "Entrepreneur",
    message:
      "With Optivest, I was able to diversify my assets easily. The tools provided helped me make smarter investment choices.",
    avatar: "https://i.pravatar.cc/100?img=2",
  },
  {
    id: 3,
    name: "Chidinma Uche",
    heading: "No doubt, Schull EDMS is the best!",
    title: "Freelancer",
    message:
      "The support team is amazing and the process is seamless. I recommend Optivest to anyone serious about wealth building.",
    avatar: "https://i.pravatar.cc/100?img=3",
  },
  {
    id: 4,
    name: "Mark Johnson",
    heading: "Highly Recommended",
    title: "Consultant",
    message:
      "I've tried other platforms, but Optivest stands out for its simplicity and depth. I’m truly impressed.",
    avatar: "https://i.pravatar.cc/100?img=4",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + 3);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev + 3 < testimonials.length ? prev + 1 : prev
    );
  };

  return (
    <section className="py-20 bg-white text-gray-800">
      <div className="max-w-7xl mx-auto px-4 text-center">
        {/* Section Heading */}
        <h2 className="text-xl  font-semibold mb-4 font-sans">What They Say</h2>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-sans">Our User Kind Words</h2>
        <p className="text-gray-600 font-normal text-[20px] max-w-2xl mx-auto mb-12 font-sans">
          Here are some testimonials from our users after using Spend.In to manage their business expenses.
        </p>



        {/* Testimonials Grid */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-auto font-sans">
          {visibleTestimonials.map((item) => (
            <div
              key={item.id}
              className="bg-[#4E40D9] shadow-sm rounded-xl px-6 py-8 text-left hover:shadow-md font-sans transition text-white"
            >
              <p className="mb-6 text-lg font-semibold">{item.heading}</p>
              <p className="mb-6 text-[16px] font-medium text-[#F3F5F7]">{item.message}</p>
              <div className="flex items-center gap-4 pt-6">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-[70px] h-[70px] rounded-xl object-cover"
                />
                <div>
                  <p className="font-bold text-lg font-sans">{item.name}</p>
                  <p className="text-sm font-normal text-[#C3D4E9]">{item.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
          {/* Arrows */}
        <div className="flex justify-center items-center mb-6 mt-4 gap-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`p-2 rounded-full bg-[#1A202C] hover:bg-gray-500 shadow-[#246BFD40] shadow-2xl  transition ${
              currentIndex === 0 ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            <FaArrowLeft size={28} className="text-white"/>
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex + 3 >= testimonials.length}
            className={`p-2 rounded-full bg-[#1A202C] hover:bg-gray-500 transition shadow-[#246BFD40] shadow-2xl ${
              currentIndex + 3 >= testimonials.length ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            <FaArrowRight size={28} className="text-white"/>
          </button>
        </div>
      </div>
    </section>
  );
}
