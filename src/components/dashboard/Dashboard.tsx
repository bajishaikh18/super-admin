"use client";
import React, { useState } from "react";
import styles from "./Dashboard.module.scss";
import Insights from "../../components/dashboard/Insights";
import RegisteredUsers from "../../components/dashboard/RegisterdUsers";
import SummarySection from "@/components/common/Summary";
import { useQuery } from "@tanstack/react-query";
import { getSummary } from "@/apis/dashboard";
import { Loader, NotFound } from "../common/Feedbacks";

const Dashboard = () => {
  const [notificationVisible] = useState(false);
  const {
    data: summaryData,
    isLoading: summaryLoading,
    error: summaryError,
  } = useQuery({ queryKey: ["summary", "dashboard"], queryFn: getSummary,retry:3 });
 
  const dashboardSummary = [
    {
      label: "Jobs Posted",
      value: summaryData?.jobsPosted || "0",
      image: "/jobs.png",
      link: '/posted-jobs'
    },
    {
      label: "Agencies Registered",
      value: summaryData?.agenciesRegistered || "0",
      image: "/agencies.png",
      link: '/agency'
    },
    {
      label: "Users Registered",
      value: summaryData?.usersRegistered || "0",
      image: "/users.png",
      link: '/users'
    },
    {
      label: "Employers",
      value: summaryData?.employers || "0",
      image: "/employers.png",
      link: '/posted-jobs'
    },
  ];
  return (
    <>
   
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
          <RegisteredUsers showButton={false} />
        </div>
      </main>
    </>
  );
};

export default Dashboard;
