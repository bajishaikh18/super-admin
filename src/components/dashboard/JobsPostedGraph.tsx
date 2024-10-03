import React from "react";
import styles from "./Dashboard.module.scss";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
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
import { Control, useForm, UseFormWatch } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { getJobCount } from "@/apis/dashboard";
import { Loader, NotFound } from "../common/Feedbacks";
import { GraphFormValues } from "./Insights";

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

const JobsPostedGraph = ({
  watch,
  control,
}: {
  watch: UseFormWatch<GraphFormValues>;
  control: Control<GraphFormValues, any>;
}) => {
  const duration = watch("jobsDuration");

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["jobposted", "dashboard", duration],
    queryFn: () => {
      let timeFrame = new Date(
        new Date().setMonth(-1 * Number(duration))
      ).toISOString();
      return getJobCount(timeFrame);
    },
    retry: 3,
  });

  const total = data?.totalJobs + data?.jobsApplied;
  const applied = (data?.jobsApplied / total) * 100;
  const totalJobs = (data?.totalJobs / total) * 100;
  const jobsData = {
    labels: ["applied", "total"],
    datasets: [
      {
        data: [applied, totalJobs - applied],
        backgroundColor: ["rgba(76, 168, 25, 1)", "rgba(246, 241, 255, 1)"],
        hoverBackgroundColor: ["#2fab53", "#b5b3f0"],
        borderWidth: 0,
        borderRadius: [30, 0],
      },
    ],
  };
  const content = (context: any) => {
    var label = context.label;
    if (label === "applied") {
      return data?.jobsApplied;
    } else {
      return data?.totalJobs;
    }
  };
  const doughnutOptions = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#fff",
        bodyColor: "#0045E6",
        titleColor: "green",
        bodyFont: {
          weight: 800,
        },
        callbacks: {
          title: () => "",
          label: content,
        },
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
    cutout: "55",
  };

  return (
    <div className={`${styles.insightCard} ${styles.smallCard}`}>
      <div className={styles.cardHeader}>
        <h2>Jobs</h2>
        <MultiSelect
          name="jobsDuration"
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
        {error && (
          <NotFound
            text="Something went wrong while fetching data"
            textSize="md"
          />
        )}
        {data && <Doughnut data={jobsData} options={doughnutOptions} />}
      </div>
      {data && (
        <>
          <div className={styles.chartLabels}>
            <span>
              <span className={styles.posted}></span> Jobs Posted
            </span>
            <span>
              <span className={styles.applied}></span> Jobs Applied
            </span>
          </div>
          <div className={styles.totalLabel}>
            <div className={styles.totalValue}>{data?.totalJobs}</div>
            <div className={styles.totalText}>Total</div>
          </div>
        </>
      )}
    </div>
  );
};

export default JobsPostedGraph;
