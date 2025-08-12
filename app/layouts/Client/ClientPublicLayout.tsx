import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Box } from '@mui/material';
import logo from '@/assets/auth/logo.svg';
import banner from '@/assets/auth/login_banner.png';
import { useUserStore } from '~/utils/store/zustandHooks';

const containerSx = {
  display: 'flex',
  height: '100svh',
  width: '100%',
};

const contentSx = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  p: 4,
};

const imageSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f5f5f5',
  '& img': {
    height: '100%',
    width: 'auto',
    objectFit: 'cover',
  },
};

const logoBoxSx = {
  // width: '40%',
  display: 'flex',
  justifyContent: 'center',
  mb: 3,
  '& img': {
    maxWidth: '200px',
    height: 'auto',
  },
};

const formContainerSx = {
  width: '100%',
  maxWidth: '500px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

export default function ClientPublicLayout() {
  const navigate = useNavigate();
  const { authenticated, user, checkAuth, token } = useUserStore();

  useEffect(() => {
    if (token) {
      if (!authenticated) {
        checkAuth('client');
        return;
      }
      if (authenticated && user) {
        // Check if user has role property (DicerUser)
        if (!('role' in user)) {
          navigate('/client', { replace: true });
        } else {
          navigate('/dicer', { replace: true });
        }
      }
    }
  }, [token, authenticated, user, navigate, checkAuth]);

  return (
    <Box sx={containerSx}>
      <Box sx={contentSx}>
        <Box component="figure" sx={logoBoxSx}>
          <img src={logo} alt="Grid by Dice logo" />
        </Box>
        <Box sx={formContainerSx}>
          <Outlet />
        </Box>
      </Box>
      <Box sx={imageSx}>
        <img src={banner} alt="Grid by Dice" />
      </Box>
    </Box>
  );
}
