"use client";
import React, { useState } from "react";
import Header from "../../components/common/header/Header";
import "@fortawesome/fontawesome-free/css/all.min.css";
import SummarySection from "@/components/common/Summary";
import { useQuery } from "@tanstack/react-query";
import { Loader, NotFound } from "../common/Feedbacks";
import PostedJobsTable from "./PostedjobsTable";
import { getJobSummary } from "@/apis/job";

const PostedJobs = () => {
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");

  const toggleNotification = () => {
    setNotificationVisible(!notificationVisible);
  };

  const {
    data: summaryData,
    isLoading: summaryLoading,
    error: summaryError,
  } = useQuery({
    queryKey: ["summary", "job"],
    queryFn: getJobSummary,
    retry: 3
  });

  console.log(summaryData);

  const dashboardSummary = [
    {
      label: "Posted",
      value: summaryData?.postedCount || "N/A",
      image: "/jobs.png",
    },
    {
      label: "Applied",
      value: summaryData?.appliedCount || "N/A",
      image: "/agencies.png",
    },
    {
      label: "Expired",
      value: summaryData?.expiredCount || "N/A",
      image: "/users.png",
    },
    {
      label: "Agencies",
      value: summaryData?.agenciesCount || "N/A",
      image: "/employers.png",
    },
  ];

  return (
    <div className={""}>
      <Header
        onNotificationToggle={toggleNotification}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <main className="main-section">
        <div className="page-block">
          <h3 className="section-heading">Jobs Summary</h3>
          {summaryLoading && (
            <Loader
              text="Fetching job summary details"
              size="md"
              textSize="md"
            />
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
          <h3 className="section-heading">Posted Jobs</h3>
          <PostedJobsTable />
        </div>
      </main>
    </div>
  );
};

export default PostedJobs;
