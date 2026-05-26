import { useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const MonthNavigator = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const getFormattedDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

  return (
    <div
      style={{
        width: "214.65px",
        height: "24.3px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "Rubik",
        fontWeight: 500,
        fontSize: "16.2px",
        lineHeight: "100%",
        letterSpacing: "0%",
        color: "#23272E", // Optional color
      }}
   
    >
      <button onClick={handlePrevious}>
        <HiChevronLeft className="text-[#23272E]" size={20} />
      </button>

      <span>{getFormattedDate(currentDate)}</span>

      <button onClick={handleNext}>
        <HiChevronRight className="text-[#23272E]" size={20} />
      </button>
    </div>
  );
};

export default MonthNavigator;
