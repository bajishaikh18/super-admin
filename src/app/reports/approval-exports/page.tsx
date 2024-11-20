"use client";
import ApprovalRequest from '@/components/reports/ApprovalForExports';
import { ROLE } from '@/helpers/constants';
import { Authorize } from '@/components/common/Authorize';
 
const EmployerReportPage = () => {
  return (
  <Authorize roles={[ROLE.superAdmin]}>
      <ApprovalRequest />
  </Authorize>
  );
};

export default EmployerReportPage;
