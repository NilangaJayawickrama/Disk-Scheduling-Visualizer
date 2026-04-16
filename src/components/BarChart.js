import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement);

function BarChart({
  comparison,
  hoverAlgo,
  setHoverAlgo,
  bestAlgo,
  worstAlgo,
}) {
  const data = {
    labels: Object.keys(comparison || {}),
    datasets: [
      {
        label: "Seek Time",
        data: Object.values(comparison || {}),
        backgroundColor: Object.keys(comparison || {}).map((algo) => {
          if (algo === bestAlgo) return "#22c55e";
          if (algo === worstAlgo) return "#ef4444";
          if (hoverAlgo === algo) return "#facc15";
          return "#00bcd4";
        }),
      },
    ],
  };

  const options = {
    onHover: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const algo = Object.keys(comparison)[index];
        setHoverAlgo(algo);
      }
    },

    plugins: {
      legend: { labels: { color: "white" } },
    },

    scales: {
      x: { ticks: { color: "white" } },
      y: { ticks: { color: "white" } },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        maxWidth: "600px",
      }}
    >
      <Bar data={data} options={options} />
    </div>
  );
}

export default BarChart;
