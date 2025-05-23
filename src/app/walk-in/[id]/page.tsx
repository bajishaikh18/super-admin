"use client";

import PostedWalkInDetails from "@/components/walkin/PostedWalkInDetails";
import React, { useState, useEffect } from "react";

type JobData = {
  media: string;
  postedDate: string;
  expiry: string;
  agencyName: string;
  location: string;
  noOfPositions: number;
};

const Page = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const [jobData, setJobData] = useState<JobData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data: JobData = {
          media: "/Rectangle.png",
          postedDate: "9 Aug 2024",
          expiry: "28 Sep 2024",
          agencyName: "Example Agency",
          location: "Dubai",
          noOfPositions: 7,
        };
        setJobData(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load job data.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (isLoading) return <p>Loading job details...</p>;
  if (error) return <p>{error}</p>;

  const handleClose = () => {
    console.log("Close button clicked");
  };

  return (
    // <ReactQueryProvider>
  <>
      {jobData ? (
      <PostedWalkInDetails
          jobId={id}
          onClose={handleClose}
        />
      ) : (
        <p>Job not found.</p>
      )}
      </>
    // {/* </ReactQueryProvider> */}
  );
};

export default Page;
