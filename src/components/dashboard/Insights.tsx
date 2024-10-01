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
import { useForm } from "react-hook-form";
import { Col, Row } from "react-bootstrap";
import AppDownloads from "./AppDownloads";
import JobsPostedGraph from "./JobsPostedGraph";
import PerformanceGraph from "./PerformanceGraph";


const Insights: React.FC = () => {
  const { insightsData } = useDashboardStore((state) => ({
    insightsData: state.insightsData,
  }));


  return (
    <div className={styles.insights}>
      <Row>
        <Col lg={6}>
            <AppDownloads/>
        </Col>
        <Col lg={3}>
          <JobsPostedGraph/>
        </Col>
        <Col lg={3}>
        <PerformanceGraph/>
        </Col>
      </Row>
    </div>
  );
};

export default Insights;
