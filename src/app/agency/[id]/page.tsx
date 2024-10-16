"use client";
import AgencyDetails from "@/components/agencies/AgencyDetails";
import React from "react";

const Page = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  return <AgencyDetails agencyId={id} />;
};

export default Page;
