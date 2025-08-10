import { Outlet, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import logo from '@/assets/spread-no-text.svg';
import banner from '@/assets/auth/login_banner.png';
import { useEffect } from 'react';
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
  mb: 3,
  '& img': {
    maxWidth: '50px',
    height: 'auto',
  },
};

export default function DicerPublicLayout() {
  const navigate = useNavigate();
  const { authenticated, user, checkAuth, token } = useUserStore();

  useEffect(() => {
    if (token) {
      if (!authenticated) {
        checkAuth();
        return;
      }
      if (authenticated && user) {
        // Check if user has account_id property (ClientUser) or role property (DicerUser)
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
        <Outlet />
      </Box>
      <Box sx={imageSx}>
        <img src={banner} alt="Grid by Dice" />
      </Box>
    </Box>
  );
}
