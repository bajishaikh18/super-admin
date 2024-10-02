import React from "react";
import styles from "../../app/dashboard/Dashboard.module.scss";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartOptions,
  BarController,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarController,
  ChartDataLabels
);

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarController,
  ChartDataLabels
);
import useDashboardStore from "../../stores/useDashboardStore";
import { MultiSelect } from "../common/form-fields/MultiSelect";
import { useForm } from "react-hook-form";
import { getGradient } from "@/helpers/graph";

type FormValues = {
  appDownloadsDuration: string;
  jobsDuration: string;
  performanceDuration: string;
};

const downloadDuration = [
  {
    value: "0",
    label: "This Year",
  },
  {
    value: "1",
    label: "Last Year",
  },
];

const AppDownloads: React.FC = () => {
  const { insightsData } = useDashboardStore((state) => ({
    insightsData: state.insightsData,
  }));

  const {
    register,
    handleSubmit,
    getValues,
    control,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormValues>();

  const appDownloadsData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        data: [
          500, 1000, 1500, 2000, 3000, 4000, 3500, 2500, 2000, 1500, 1000, 500,
        ],
        backgroundColor: function (context: any) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            // This case happens on initial chart load
            return;
          }
          return getGradient(ctx, chartArea,'vertical');
        },
        borderColor: function (context: any) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            // This case happens on initial chart load
            return;
          }
          return getGradient(ctx, chartArea,'vertical');
        },
        borderWidth: 2,
        borderRadius: 5,
        barThickness: 15,
      },
    ],
  };

  const barChartOptions: ChartOptions<"bar"> = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#fff",
        bodyColor: "#0045E6",
        titleColor: "#0045E6",
        bodyFont: {
          weight: 800,
        },
        position: "nearest",
        xAlign: "left",
        cornerRadius: 18,
        padding: {
          left: 11,
          right: 11,
          top: 2,
          bottom: 2,
        },
        borderColor: "rgba(0, 69, 230, 0.26)",
        caretSize: 0,
        displayColors: false,
      },
      datalabels: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "rgba(33, 33, 33, 1)",
          padding: 10,
          font: {
            size: 14,
          },
        },
        border: {
          color: "rgba(183, 182, 252, 1)",
          width: 1,
        },
      },
      y: {
        min: 0,
        max: 4000,
        ticks: {
          stepSize: 1000,
          font: {
            size: 14,
          },
          color: "rgba(117, 117, 117, 1)",
          callback: function (tickValue: string | number) {
            if (typeof tickValue === "number") {
              return [1000, 2000, 3000, 4000].includes(tickValue)
                ? tickValue
                : "";
            }
            return "";
          },
        },
        grid: {
          display: true,
          color: "rgba(246, 241, 255, 1)",
        },
        border: {
          display: false,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div
      className={`${styles.insightCard} ${styles.largeCard} ${styles.appDownloadsCard}`}
    >
      <div className={styles.cardHeader}>
        <h2>App downloads</h2>
        <MultiSelect
          name="appDownloadsDuration"
          control={control}
          options={downloadDuration}
          customStyles={{
            border: "none !important",
            boxShadow: "none !important",
            fontSize: "14px",
            padding: "0 !important",
            "&:focus": {
              border: "none",
            },
          }}
          valueContainerStyles={{
            padding: "0px",
            color: "rgba(117, 117, 117, 1) !important",
          }}
          menuListStyles={{
            fontSize: "13px",
            textAlign: "left",
          }}
          defaultValue={"0"}
        />
      </div>
      <div className={styles.graphContainer}>
        <Bar data={appDownloadsData} options={barChartOptions} />
      </div>
    </div>
  );
};

export default AppDownloads;
