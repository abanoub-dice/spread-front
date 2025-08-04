import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Box } from '@mui/material';
import logo from '@/assets/spread-logo.svg';
import banner from '@/assets/auth/login_banner.png';
import { useAppSelector, useAppDispatch } from '~/utils/store/hooks/hooks';
import { checkAuth } from '~/utils/store/slices/userSlice';
import { UserType } from '~/utils/interfaces/user';

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
  width: '40%',
  display: 'flex',
  justifyContent: 'center',
  mb: 3,
  '& img': {
    maxWidth: '200px',
    height: 'auto',
  },
};

export default function ClientPublicLayout() {
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
      if (authenticated && user) {
        if (user.type === UserType.CLIENT) {
          navigate('/client', { replace: true });
        } else {
          navigate('/dicer', { replace: true });
        }
      }
    }
  }, [hasToken, authenticated, user, navigate, dispatch]);

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
