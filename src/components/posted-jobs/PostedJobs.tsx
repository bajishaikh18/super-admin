"use client";
import React, { useEffect } from "react";
import SummarySection from "@/components/common/Summary";
import { useQuery } from "@tanstack/react-query";
import { Loader, NotFound } from "../common/Feedbacks";
import PostedJobsTable from "./PostedjobsTable";
import { getJobSummary } from "@/apis/job";
import { useAuthUserStore } from "@/stores/useAuthUserStore";
import { ROLE } from "@/helpers/constants";

const PostedJobs = () => {
  const {shouldVisible} = useAuthUserStore();
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
      label: "Applied",
      value: summaryData?.appliedCount || "0",
      image: "/agencies.png",
    },
    {
      label: "Expired",
      value: summaryData?.expiredCount || "0",
      image: "/users.png",
    },
    shouldVisible([ROLE.admin,ROLE.superAdmin])?
    {
      label: "Agencies",
      value: summaryData?.agenciesCount || "0",
      image: "/employers.png",
      link: '/agency'
    } : null,
  ];

  
  return (
    <>
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
        
          <PostedJobsTable />
      </main>
    </>
  );
};

export default PostedJobs;
