"use client";
import AgencyDetails from "@/components/agencies/AgencyDetails";
import { Authorize } from "@/components/common/Authorize";
import { ROLE } from "@/helpers/constants";
import React from "react";

const Page = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  return (
    <Authorize roles={[ROLE.superAdmin, ROLE.admin]}>
      <AgencyDetails agencyId={id} />
    </Authorize>
  );
};

export default Page;
