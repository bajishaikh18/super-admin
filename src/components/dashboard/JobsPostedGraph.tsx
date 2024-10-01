import React from "react";
import styles from "../../app/dashboard/Dashboard.module.scss";
import { Bar, Doughnut } from "react-chartjs-2";
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
import { textAlign } from "html2canvas/dist/types/css/property-descriptors/text-align";
import { Col, Row } from "react-bootstrap";

type FormValues = {
  appDownloadsDuration: string;
  jobsDuration: string;
  performanceDuration: string;
};

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

const JobsPostedGraph: React.FC = () => {
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

  const jobsData = {
    datasets: [
      {
        data: [5263, 12415],
        backgroundColor: ["rgba(76, 168, 25, 1)", "rgba(246, 241, 255, 1)"],
        hoverBackgroundColor: ["#2fab53", "#b5b3f0"],
        borderWidth: 0,
        borderRadius: [30, 0],
      },
    ],
  };

  const doughnutOptions = {
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
        <Doughnut data={jobsData} options={doughnutOptions} />
      </div>
      <div className={styles.chartLabels}>
        <span>
          <span className={styles.posted}></span> Jobs Posted
        </span>
        <span>
          <span className={styles.applied}></span> Jobs Applied
        </span>
      </div>
      <div className={styles.totalLabel}>
        <div className={styles.totalValue}>12,415</div>
        <div className={styles.totalText}>Total</div>
      </div>
    </div>
  );
};

export default JobsPostedGraph;
