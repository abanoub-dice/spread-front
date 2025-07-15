import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Box, Container, Paper } from '@mui/material';
import logo from '@/assets/spread-logo.svg';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '~/utils/store/hooks/hooks';
import { checkAuth } from '~/utils/store/slices/userSlice';
import { UserType } from '~/utils/interfaces/user';

const containerSx = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100svh',
};

const paperSx = {
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
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

// Public routes that should use the centered layout
const publicRoutes = ['/dicer/login', '/dicer/forgot-password', '/dicer/reset-password'];

export default function DicerPublicLayout() {
  const location = useLocation();
  const isPublicRoute = publicRoutes.includes(location.pathname);
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
        if (user.role === UserType.CLIENT) {
          navigate('/client', { replace: true });
        } else {
          navigate('/dicer', { replace: true });
        }
      }
    }
  }, [hasToken, authenticated, user, navigate, dispatch]);

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={containerSx}>
        <Paper elevation={3} sx={paperSx}>
          <Box component="figure" sx={logoBoxSx}>
            <img src={logo} alt="Grid by Dice logo" />
          </Box>
          <Outlet />
        </Paper>
      </Box>
    </Container>
  );
}
