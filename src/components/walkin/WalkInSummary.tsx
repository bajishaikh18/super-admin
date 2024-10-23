"use client";
import React, { useEffect } from "react";
import SummarySection from "@/components/common/Summary";
import { useQuery } from "@tanstack/react-query";
import { Loader, NotFound } from "../common/Feedbacks";
import PostedWalkInTable from "./PostedWalkIn";
import { getJobSummary } from "@/apis/job";

const WalkIn = () => {
  const {
    data: summaryData,
    isLoading: summaryLoading,
    error: summaryError,
  } = useQuery({
    queryKey: ["summary", "jobs"],
    queryFn: getJobSummary,
    retry: 3,
    refetchOnMount: true,
  });


  const dashboardSummary = [
    {
      label: "Posted",
      value: summaryData?.postedCount || "0",
      image: "/jobs.png",
    },
    {
      label: "Expired",
      value: summaryData?.expiredCount || "0",
      image: "/users.png",
    },
    {
      label: "Agencies",
      value: summaryData?.agenciesCount || "0",
      image: "/employers.png",
      link: '/posted-jobs'
    },
  ];

  return (
    <>
      <main className="main-section">
        <div className="page-block">
          <h3 className="section-heading">Walk-In Summary</h3>
          {summaryLoading && (
            <Loader
              text="Fetching walkin summary details"
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
        
          <PostedWalkInTable />
      </main>
    </>
  );
};

export default WalkIn;
