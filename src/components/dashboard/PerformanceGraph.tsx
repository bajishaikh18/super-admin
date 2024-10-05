import React from "react";
import styles from "./Dashboard.module.scss";
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
import { MultiSelect } from "../common/form-fields/MultiSelect";
import { Control, UseFormWatch } from "react-hook-form";
import { getGradient } from "@/helpers/graph";
import { GraphFormValues } from "./Insights";
import { useQuery } from "@tanstack/react-query";
import { getSitePerformance } from "@/apis/dashboard";
import { Loader, NotFound } from "../common/Feedbacks";
import { DateTime } from "luxon";

const durations = [
  {
    value: "0",
    label: "This Month",
  },
  {
    value: "1",
    label: "Last Month",
  },
  {
    value: "3",
    label: "Last 3 Months",
  },
];

const PerformanceGraph = ({
  watch,
  control,
}: {
  watch: UseFormWatch<GraphFormValues>;
  control: Control<GraphFormValues, any>;
}) => {
  const duration = watch("performanceDuration");

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["performance", "dashboard", duration],
    queryFn: () => {
      const month = DateTime.now().month;
      const timeFrame = DateTime.now().set({month:month+Number(duration)*-1}).toISO()
      return getSitePerformance(timeFrame);
    },
    retry: 3,
  });

  const isDataPresent = data ? Object.values(data).some((x) => x) : false;
  const max = data ? Math.max(...(Object.values(data) as number[])) : 0;
  const sitePerformanceData = {
    labels: [
      "No of visits",
      "No. of Registrations",
      "Work videos uploaded",
      "CVs uploaded",
    ],
    datasets: [
      {
        data: [
          data?.visits,
          data?.registrations,
          data?.workVideoCount,
          data?.resumeCount,
        ],
        backgroundColor: function (context: any) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            // This case happens on initial chart load
            return;
          }
          return getGradient(ctx, chartArea, "horizontal");
        },
        borderColor: function (context: any) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            // This case happens on initial chart load
            return;
          }
          return getGradient(ctx, chartArea, "horizontal");
        },
        borderWidth: 2,
        borderRadius: 5,
        barThickness: 12,
      },
    ],
  };

  const barChartOptionsHorizontal: ChartOptions<"bar"> = {
    indexAxis: "y",
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
        display: true,
        anchor: "end",
        align: "right",
        formatter: (value: number) => value,
        color: "#000",
        font: {
          size: 10,
          weight: 600,
        },
      },
    },

    scales: {
      x: {
        max:max+max/4,
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: "rgba(33, 33, 33, 1)",
          padding: 10,
          font: {
            size: 12,
          },
          crossAlign: "far",
        },
        border: {
          color: "rgba(183, 182, 252, 1)",
        },
      },
    },
  };
  return (
    <div
      className={`${styles.insightCard} ${styles.smallCard}  ${styles.performanceCard}`}
    >
      <div className={styles.cardHeader}>
        <h2>Site Performance</h2>
        <MultiSelect
          name="performanceDuration"
          control={control}
          options={durations}
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
        {(isLoading || isFetching) && (
          <Loader text="Fetching job details details" size="md" textSize="md" />
        )}

        {isDataPresent && (!isLoading && !isFetching) ? (
          <Bar data={sitePerformanceData} options={barChartOptionsHorizontal} />
        ) : (
          <>
            {!isLoading && !isFetching && (
              <>
                {!error ? (
                  <NotFound
                    text="No data present for the selected duration"
                    textSize="md"
                  />
                ) : (
                  <NotFound
                    text="Something went wrong while fetching data"
                    textSize="md"
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PerformanceGraph;
