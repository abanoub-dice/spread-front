import { Outlet, useLocation } from 'react-router-dom';
import { Box, Container, Paper } from '@mui/material';
import logo from '@/assets/spread-logo.svg';

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
const publicRoutes = ['/client/login', '/client/forgot-password', '/client/reset-password'];

export default function ClientPublicLayout() {
  const location = useLocation();
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // For public routes (login, forgot password, etc.), use the centered layout
  if (isPublicRoute) {
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

  // For protected routes, use the full layout (similar to ClientLayout)
  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
} 