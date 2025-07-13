import { Outlet } from 'react-router-dom';
import Navbar from '../../components/shared/navbar/Navbar';
import DashboardHeader from '../../components/dicer/dashboard-header/DashboardHeader';
import ProjectTabs from '../../components/dicer/tabs/DicerTabs';
import { Box } from '@mui/material';

export default function Layout() {
  const handleGenerateReport = (accountId: string, selectedMonth: any) => {
    console.log('Generating report for:', accountId, 'Month:', selectedMonth.format('MMMM YYYY'));
    // Implement your report generation logic here
  };

  return (
    <div className="h-screen w-full bg-gray-100">
      <Navbar avatarUrl={undefined} onLogout={() => alert('Logout')} />
      <Box sx={{ p: 3 }}>
        <DashboardHeader onGenerateReport={handleGenerateReport} />
        <ProjectTabs />
        <main>
          <Outlet />
        </main>
      </Box>
    </div>
  );
}
