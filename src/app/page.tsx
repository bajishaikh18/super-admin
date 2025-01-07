'use client'
import Dashboard from '@/components/dashboard/Dashboard';

import { ROLE } from '@/helpers/constants';
import { Authorize } from '@/components/common/Authorize';

const DashboardPage = () => {
  return (
    // <ReactQueryProvider>
    <Authorize roles={[ROLE.superAdmin]}>
      <Dashboard/>
     </Authorize>
    // </ReactQueryProvider>
  )
};
export default DashboardPage;




