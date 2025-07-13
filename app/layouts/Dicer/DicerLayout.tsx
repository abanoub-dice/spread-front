import { Outlet } from 'react-router-dom';
import Navbar from '../../components/shared/navbar/Navbar';
import DashboardHeader from '../../components/dicer/dashboard-header/DashboardHeader';

export default function Layout() {
  const handleGenerateReport = (accountId: string, selectedMonth: any) => {
    console.log('Generating report for:', accountId, 'Month:', selectedMonth.format('MMMM YYYY'));
    // Implement your report generation logic here
  };

  return (
    <div className="h-screen w-full bg-gray-100">
      <Navbar
        avatarUrl={undefined}
        onLogout={() => alert('Logout')}
      />
      <DashboardHeader
        onGenerateReport={handleGenerateReport}
      />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
