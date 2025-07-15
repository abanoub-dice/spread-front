import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../../components/shared/navbar/Navbar';
import DashboardHeader from '../../components/dicer/dashboard-header/DashboardHeader';
import ProjectTabs from '../../components/dicer/tabs/DicerTabs';
import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '~/utils/store/hooks/hooks';
import { checkAuth } from '~/utils/store/slices/userSlice';
import { UserType } from '~/utils/interfaces/user';

export default function Layout() {
  const handleGenerateReport = (accountId: string, selectedMonth: any) => {
    console.log('Generating report for:', accountId, 'Month:', selectedMonth.format('MMMM YYYY'));
    // Implement your report generation logic here
  };

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { authenticated, user } = useAppSelector(state => state.user.data);
  const hasToken = typeof window !== 'undefined' && localStorage.getItem('token');

  useEffect(() => {
    if (hasToken) {
      if (!authenticated) {
        dispatch(checkAuth());
        return;
      }
      if (authenticated && user && user.type !== UserType.DICER) {
        navigate(`/client`, { replace: true });
      }
    } else {
      navigate('/dicer/login', { replace: true });
      return;
    }
  }, [hasToken, authenticated, user, navigate, dispatch]);

  if (!authenticated) return null;

  return (
    <div className="h-screen w-full">
      <Navbar avatarUrl={undefined} onLogout={() => alert('Logout')} />
      <Box sx={{ p: 3, backgroundColor: '#f7f9fa' }}>
        {/* <DashboardHeader onGenerateReport={handleGenerateReport} /> */}
        <ProjectTabs />
        <main>
          <Outlet />
        </main>
      </Box>
    </div>
  );
}
