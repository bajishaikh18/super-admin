'use client'
import Dashboard from '@/components/dashboard/Dashboard';
import { ReactQueryProvider } from '../react-quuery-provider';

const DashboardPage = () => {
  return (
    <ReactQueryProvider>
     <Dashboard/>
    </ReactQueryProvider>
  )
};
export default DashboardPage;




