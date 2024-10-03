import React from "react";
import styles from "./Dashboard.module.scss";
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
import { useForm } from "react-hook-form";
import { Col, Row } from "react-bootstrap";
import AppDownloads from "./AppDownloads";
import JobsPostedGraph from "./JobsPostedGraph";
import PerformanceGraph from "./PerformanceGraph";


export type GraphFormValues = {
  appDownloadsDuration: string;
  jobsDuration: string;
  performanceDuration: string;
};


const Insights: React.FC = () => {
  const {
    watch,
    control,
  } = useForm<GraphFormValues>();

  return (
    <div className={styles.insights}>
      <Row>
        <Col lg={6}>
            <AppDownloads/>
        </Col>
        <Col lg={3}>
          <JobsPostedGraph control={control} watch={watch}/>
        </Col>
        <Col lg={3}>
        <PerformanceGraph control={control} watch={watch}/>
        </Col>
      </Row>
    </div>
  );
};

export default Insights;
