import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import MonthNavigator from "./MonthNavigator";

ChartJS.register(ArcElement, Tooltip);

export default function LayeredDonutChart() {
  const paidOffData = {
    labels: ["Paid Off"],
    datasets: [
      {
        data: [300, 90],
        backgroundColor: ["#5639D4", "transparent"],
        borderWidth: 0,
        cutout: "70%", // Makes it thick
        radius: "100%", // Full outer radius
        // rotation: -1.97, // Optional angle
        borderRadius:5,
      },
    ],
  };

  const outstandingData = {
    labels: ["Outstanding Balance"],
    datasets: [
      {
        data: [35, 65],
        backgroundColor: ["#D3D3D3", "transparent"],
        borderWidth: 0,
        // borderRadius:10,
        cutout: "80%", // Makes it thinner
        radius: "90%", // Slightly smaller than paidOff chart
        // rotation: -1.97,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return (
    <div className="border border-[#F2F2F2] p-[16.2px] rounded-[8.1px]">
        <div className="flex flex-col gap-4 mb-4 justify-center">
            <h1 className="font-rubik font-[600] text-black text-[20.25px] text-center ">Loan Status </h1>
        <MonthNavigator />
        </div>
        <div
      style={{
        width: "260px",
        height: "260px",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
      >
        <Doughnut data={outstandingData} options={options} />
      </div>
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        className="rotate-[126deg]"
      >
        <Doughnut data={paidOffData} options={options} />
      </div>

     
    </div>
    </div>
  );
}
