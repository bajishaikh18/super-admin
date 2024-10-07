"use client";
import React, { useState } from "react";
import styles from "./Dashboard.module.scss";
import Header from "../../components/common/header/Header";
import Insights from "../../components/dashboard/Insights";
import RegisteredUsers from "../../components/dashboard/RegisterdUsers";
import "@fortawesome/fontawesome-free/css/all.min.css";
import SummarySection from "@/components/common/Summary";
import useDashboardStore from "@/stores/useDashboardStore";
import { useQuery } from "@tanstack/react-query";
import { getJobCount, getSummary } from "@/apis/dashboard";
import { Loader, NotFound } from "../common/Feedbacks";
import { useForm } from "react-hook-form";

const Dashboard = () => {
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const {
    data: summaryData,
    isLoading: summaryLoading,
    error: summaryError,
  } = useQuery({ queryKey: ["summary", "dashboard"], queryFn: getSummary,retry:3 });
  const toggleNotification = () => {
    setNotificationVisible(!notificationVisible);
  };

  const dashboardSummary = [
    {
      label: "Jobs Posted",
      value: summaryData?.jobsPosted || "N/A",
      image: "/jobs.png",
    },
    {
      label: "Agencies Registered",
      value: summaryData?.agenciesRegistered || "N/A",
      image: "/agencies.png",
    },
    {
      label: "Users Registered",
      value: summaryData?.usersRegistered || "N/A",
      image: "/users.png",
    },
    {
      label: "Employers",
      value: summaryData?.employers || "N/A",
      image: "/employers.png",
    },
  ];
  return (
    <div className=''>
   
      {notificationVisible && (
        <div className={styles.notificationPanel}>
          <div className={styles.notificationHeader}>
            Notifications{" "}
            <a className={styles.markAllRead} href="#">
              Mark all as read
            </a>
          </div>
          <div className={styles.notificationSection}>
            <h4>New (2)</h4>
            <div className={styles.notificationItem}>
              <div className={styles.notificationContent}>
                <p className={styles.notificationTitle}>
                  Falcon Human Resource Consultancy
                </p>
                <span className={styles.notificationDescription}>
                  New Agency has been created
                </span>
                <time className={styles.notificationTime}>2 mins</time>
              </div>
            </div>
            <div className={styles.notificationItem}>
              <div className={styles.notificationContent}>
                <p className={styles.notificationTitle}>Jobs for Oman</p>
                <span className={styles.notificationDescription}>
                  New job post has been created
                </span>
                <time className={styles.notificationTime}>16 mins</time>
              </div>
            </div>
          </div>
          <div className={styles.notificationSection}>
            <h4>Previous</h4>
            <div className={styles.notificationItem}>
              <div className={styles.notificationContent}>
                <p className={styles.notificationTitle}>
                  New request for an Employer
                </p>
                <a href="#">View Details</a>
                <time
                  className={`${styles.notificationTime} ${styles.yesterday}`}
                >
                  Yesterday
                </time>
              </div>
            </div>
            <div className={styles.notificationItem}>
              <div className={styles.notificationContent}>
                <p className={styles.notificationTitle}>
                  Report has been generated
                </p>
                <span className={styles.notificationDescription}>
                  New job post has been created
                </span>
                <time className={styles.notificationTime}>20-July-2024</time>
              </div>
            </div>
            <div className={styles.notificationItem}>
              <div className={styles.notificationContent}>
                <p className={styles.notificationTitle}>
                  Reached 100K app downloads
                </p>
                <span className={styles.notificationDescription}>
                  New job post has been created
                </span>
                <time className={styles.notificationTime}>12-July-2024</time>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="main-section">
        <div className="page-block">
          <h3 className="section-heading">Summary</h3>

          {summaryLoading && (
            <Loader text="Fetching summary details" size="md" textSize="md" />
          )}
          {summaryError && (
            <NotFound
              text="Something went wrong while fetching data"
              textSize="md"
            />
          )}
          {summaryData && <SummarySection summaryData={dashboardSummary} />}
        </div>
        <div className="page-block">
          <h3 className="section-heading">Insights</h3>
          <Insights />
        </div>

        <div className="page-block">
          <h3 className="section-heading">Registered users</h3>
          <RegisteredUsers />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
