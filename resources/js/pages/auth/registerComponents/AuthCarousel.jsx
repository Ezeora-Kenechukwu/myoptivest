import { useEffect, useRef, useState } from "react";
import { IoMdStar } from "react-icons/io";
import { Link } from "@inertiajs/react";
import AppLogoIcon from "@/components/app-logo-icon";
import profile from "@/components/images/profile.jpg";

// Testimonials Data
const testimonials = [
  {
    name: "Eliska Trebalska",
    role: "Mother",
    text: "I have made great profit from using optivest to invest",
    date: "8:35 PM – Jan 4, 2022",
    image: profile,
  },
  {
    name: "James Oluwole",
    role: "Software Engineer",
    text: "The platform is intuitive and yields great returns!",
    date: "2:15 PM – Feb 10, 2022",
    image: profile,
  },
  {
    name: "Amaka Johnson",
    role: "Entrepreneur",
    text: "Reliable and transparent. Optivest changed my finances.",
    date: "6:00 PM – Mar 2, 2022",
    image: profile,
  },
];

export default function AuthCarousel() {
  const [index, setIndex] = useState(0);
  const containerRef = useRef(null);

  // Auto-slide every 5s (Right to Left)
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to center the active card
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const childWidth = container.children[0]?.offsetWidth || 0;
    const scrollTo =
      (childWidth + 16) * index - container.offsetWidth / 2 + childWidth / 2;

    container.scrollTo({ left: scrollTo, behavior: "smooth" });
  }, [index]);

  return (
    <div className="w-full min-h-screen px-6 md:px-8 py-5 max-w-md mx-auto flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col gap-6 items-start">
        <Link href={route("home")} className="flex flex-col items-center gap-2 font-medium">
          <div className="mb-1 flex items-center justify-center rounded-md">
            <AppLogoIcon />
          </div>
        </Link>
        <div>
          <h2 className="text-2xl font-bold mb-4">Start your investing journey with Optivest</h2>
          <p className="mb-8 text-white">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ut placerat orci.
          </p>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative mt-4 overflow-hidden">
        <div
          ref={containerRef}
          className="flex items-center gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x px-1"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {testimonials.map((item, i) => {
            const isActive = i === index;
            const scale = isActive ? "scale-105" : "scale-95";
            const height = isActive ? "md:h-48" : "md:h-42";
            const opacity = isActive ? "opacity-100" : "opacity-60";

            return (
              <div
                key={i}
                onClick={() => setIndex(i)}
                className={`shrink-0 w-72  bg-white text-black rounded-3xl shadow-lg p-4 cursor-pointer transform transition-all duration-500 ${scale} ${height} ${opacity} snap-center`}
              >
                <div className="flex gap-3">
                  <img src={item.image} alt={item.name} className="block h-10 w-10 rounded-full" />
                  <div>
                    <div className="text-sm font-semibold">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.role}</div>
                  </div>
                </div>
                <p className="mt-2 text-sm">{item.text}</p>
                <div className="text-xs mt-2 flex items-center justify-between">
                  <p>{item.date}</p>
                  <div className="flex text-green-900">
                    {Array(5)
                      .fill(0)
                      .map((_, idx) => (
                        <IoMdStar key={idx} />
                      ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-4 gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                index === i ? "bg-green-600 w-4" : "bg-gray-300"
              }`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
