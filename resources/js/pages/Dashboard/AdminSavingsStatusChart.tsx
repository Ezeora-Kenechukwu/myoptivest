// @ts-nocheck
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";
import { useState } from "react";
import { HiChevronDown } from "react-icons/hi";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

const AdminSavingsStatusChart = () => {
  const [selectedRange, setSelectedRange] = useState("Last 7 Days");

  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
  {
    label: "Savings",
    data: [1000, 1500, 800, 1700, 1400, 2000, 2200],
    borderColor: "#24E795", // Keep it simple or use gradient plugin if needed
    backgroundColor: "transparent",
    borderWidth: 3.04,
    tension: 0.4,
    pointRadius: 0,          // 🔑 Hides dots
    pointHoverRadius: 0,     // 🔑 Optional: disables hover dots
  },
  {
    label: "Investments",
    data: [400, 900, 300, 1000, 700, 1500, 1300],
    borderColor: "#FF92AE",
    backgroundColor: "transparent",
    borderWidth: 3.04,
    tension: 0.4,
    pointRadius: 0,
    pointHoverRadius: 0,
  }
],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: {
            family: "Rubik",
          },
        },
      },
      y: {
        grid: { display: false },
        ticks: {
          font: {
            family: "Rubik",
          },
        },
      },
    },
  };

  const ranges = ["Today", "Yesterday", "Last 7 Days", "Last 14 Days", "Last 30 Days", "This Month", "Last Month"];

  return (
    <div className="w-full  max-w-[1000px] shadow-sm rounded-[16.2px] p-[24.3px] shadow-[#3232470D]">
      <div className="flex justify-between items-center mb-4">
        <h1
          style={{
            fontFamily: "Rubik",
            fontWeight: 500,
            fontSize: "20.25px",
            lineHeight: "25.31px",
          }}
          className="text-[#23272E]"
        >
          Opti Transactions
        </h1>

        <div className="relative">
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="appearance-none border border-[#D1D5DB] text-[#374151] font-rubik font-[400] px-4 py-2 rounded-lg pr-8"
          >
            {ranges.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <HiChevronDown className="absolute right-3 top-2.5 pointer-events-none text-gray-500" />
        </div>
      </div>

      <div className="w-full" style={{ height: "400px" }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default AdminSavingsStatusChart;
