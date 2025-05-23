"use client";
import PostedJobDetails from "@/components/posted-jobs/PostedJobDetails";
import React from "react";

const Page = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  return <PostedJobDetails jobId={id} />;
};

export default Page;
