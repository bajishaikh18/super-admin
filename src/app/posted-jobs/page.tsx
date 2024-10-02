"use client";
import React, { useState } from "react";
import Header from "../../components/common/header/Header";
import JobSummary from "../Summary/jobsummary";
import PostedJobs from "../Summary/postedjobs";
import styles from "../../app/dashboard/Dashboard.module.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Image from "next/image";
import { Button } from "react-bootstrap";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SummarySection from "@/components/common/Summary";

const PostJob = () => {
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const queryClient = new QueryClient()

  const toggleNotification = () => {
    setNotificationVisible(!notificationVisible);
  };

  return (
    <div className={styles.dashboard}>
      <Header
        onNotificationToggle={toggleNotification}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <main className="main-section">
        <div className="page-block">
            <h3 className="section-heading">Summary</h3>
            <SummarySection summaryData={{} as any}/>
        </div>
        <>
          <section className={styles.postedJobsHeader}>
            <p>Posted Jobs</p>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search"
                className={styles.searchInput}
              />
              <Image
                src="/Search.png"
                alt="Search"
                width={16}
                height={16}
                className={styles.searchImg}
              />
              <div className={styles.groupContainer}>
                <Image
                  src="/Group.png"
                  alt="Group"
                  width={16}
                  height={16}
                  className={styles.groupImg}
                />
              </div>
              <Button type="submit" className={`btn ${styles.button}`}>
                <Image
                  src="/Upload.png"
                  alt="Upload"
                  width={16}
                  height={16}
                  className={styles.buttonIcon}
                />
                Post A New Job
              </Button>
            </div>
          </section>
          <QueryClientProvider client={queryClient}>
          <PostedJobs />
          </QueryClientProvider>
        </>
      </main>
    </div>
  );
};

export default PostJob;
