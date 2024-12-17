import { Line, Doughnut } from "react-chartjs-2";
import { getLastWeek } from "../../lib/features";
import {
  Chart as ChartJs,
  CategoryScale,
  Tooltip,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend,
  plugins,
} from "chart.js";

const labels = getLastWeek();

ChartJs.register(
  CategoryScale,
  Tooltip,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend
);

const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },

  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
  },
};

function LineChart({ value = [] }) {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        label: "Messages",
        fill: true,
        backgroundColor: "#1001",
        borderColor: "rgba(75,92,192,1)",
      },
    ],
  };
  return (
    <Line
      data={data}
      options={lineChartOptions}
    />
  );
}

const DoughnutChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  cutout: 120,
};

function DoughnutChart({ value = [], labels = [] }) {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        fill: true,
        backgroundColor: ["orange", "rgba(75, 92, 192, 1)"],
        borderColor: ["orange", "rgba(75, 92, 192, 1)"],
        offset: 10,
      },
    ],
  };
  return (
    <Doughnut
      style={{ zIndex: 10 }}
      data={data}
      options={DoughnutChartOptions}
    />
  );
}

export { LineChart, DoughnutChart };
