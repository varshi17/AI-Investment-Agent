import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const StockChart = ({ historical }) => {

  if (!historical || historical.s !== "ok")
    return null;

  const labels = historical.t.map((time) =>
    new Date(time * 1000).toLocaleDateString()
  );

  const prices = historical.c;

  const data = {
    labels,

    datasets: [
      {
        label: "Closing Price",

        data: prices,

        borderColor: "#3B82F6",

        backgroundColor:
          "rgba(59,130,246,.2)",

        fill: true,

        tension: .4,
      },
    ],
  };

  const options = {
    responsive: true,

    plugins: {

      legend: {

        labels: {

          color: "white",

        },

      },

    },

    scales: {

      x: {

        ticks: {

          color: "white",

          maxTicksLimit: 8,

        },

      },

      y: {

        ticks: {

          color: "white",

        },

      },

    },

  };

  return (

    <div className="bg-slate-900 rounded-xl p-6">

      <h2 className="text-2xl font-bold mb-5">

        30 Day Price Chart

      </h2>

      <Line

        data={data}

        options={options}

      />

    </div>

  );

};

export default StockChart;