import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../../components/shared/navbar/Navbar';
import AccountSelector from '../../components/dicer/dashboard-header/AccountSelector';
import DicerNavigation from '../../components/dicer/tabs/DicerNavigation';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useUserStore } from '~/utils/store/zustandHooks';

interface Account {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

export default function Layout() {
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>();

  const navigate = useNavigate();
  const { authenticated, user, checkAuth, token, resetUser } = useUserStore();
  useEffect(() => {
    if (token) {
      if (!authenticated) {
        checkAuth();
        return;
      }
      if (authenticated && user && !('role' in user)) {
        navigate(`/client`, { replace: true });
      }
    } else {
      navigate('/dicer/login', { replace: true });
      return;
    }
  }, [token, authenticated, user, navigate, checkAuth]);

  const handleAccountSelect = (account: Account) => {
    setSelectedAccount(account);
    console.log('Selected account:', account);
    // You can add additional logic here like updating global state, API calls, etc.
  };

  if (!authenticated) return null;

  return (
    <div className="h-screen w-full">
      <Navbar avatarUrl={undefined} onLogout={resetUser} />
      <Box
        sx={{
          display: 'flex',
          height: 'calc(100vh - 64px)', // Subtract navbar height
        }}
      >
        {/* Sidebar */}
        <Box
          sx={{
            width: '20%',
            borderRight: '1px solid #e0e0e0',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            backgroundColor: 'background.defaultSecondary',
          }}
        >
          <AccountSelector
            onAccountSelect={handleAccountSelect}
            selectedAccountId={selectedAccount?.id}
          />
          <DicerNavigation />
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            p: 3,
            overflow: 'auto',
          }}
        >
          <main>
            <Outlet />
          </main>
        </Box>
      </Box>
    </div>
  );
}
