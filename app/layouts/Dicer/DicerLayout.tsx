import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../../components/shared/navbar/Navbar';
import DashboardHeader from '../../components/dicer/dashboard-header/DashboardHeader';
import DicerNavigation from '../../components/dicer/tabs/DicerNavigation';
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
      <Box sx={{ 
        display: 'flex', 
        height: 'calc(100vh - 64px)', // Subtract navbar height
        backgroundColor: '#f7f9fa' 
      }}>
        {/* Sidebar */}
        <Box sx={{ 
          width: '20%', 
          backgroundColor: 'white',
          borderRight: '1px solid #e0e0e0',
          p: 2
        }}>
          <DicerNavigation />
        </Box>
        
        {/* Main Content */}
        <Box sx={{ 
          flex: 1, 
          p: 3,
          overflow: 'auto'
        }}>
          {/* <DashboardHeader onGenerateReport={handleGenerateReport} /> */}
          <main>
            <Outlet />
          </main>
        </Box>
      </Box>
    </div>
  );
}
