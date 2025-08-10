import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useUserStore } from '~/utils/store/zustandHooks';
import { UserRole } from '~/utils/interfaces/user';

const adminTabs = [
  { label: 'Clients', path: '/dicer/admin/clients' },
  { label: 'Accounts', path: '/dicer/admin/accounts' },
  { label: 'Team Members', path: '/dicer/admin/team' },
];

export default function AdminPanel() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (user && 'role' in user && user.role !== UserRole.ADMIN) {
      navigate(`/dicer`, { replace: true });
    } else {
      if (location.pathname === '/dicer/admin' || location.pathname === '/dicer/admin/') {
        navigate('/dicer/admin/clients', { replace: true });
      }
    }
  }, [user, navigate, location.pathname]);

  return (
    <Box
      sx={{
        width: '100%',
        border: `1.5px solid ${theme.palette.custom?.lightBorder || '#d7d7d7'}`,
        borderRadius: 3,
        boxShadow: '0 1px 8px 0 rgba(0,0,0,0.04)',
        p: 4,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mb: 3,
          borderRadius: 2,
          overflow: 'hidden',
          border: `1.5px solid ${theme.palette.custom?.lightBorder || '#d7d7d7'}`,
          backgroundColor: theme.palette.background.paper,
          width: 'fit-content',
        }}
      >
        {adminTabs.map(({ label, path }, idx) => {
          const isActive = location.pathname.startsWith(path);
          return (
            <Button
              key={path}
              onClick={() => navigate(path)}
              disableElevation
              sx={{
                px: 3,
                py: 1.2,
                minWidth: 0,
                borderRadius: 0,
                borderRight:
                  idx !== adminTabs.length - 1
                    ? `1px solid ${theme.palette.custom?.lightBorder || '#d7d7d7'}`
                    : 'none',
                color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                backgroundColor: isActive ? theme.palette.background.paper : 'transparent',
                fontWeight: isActive ? 600 : 400,
                boxShadow: isActive ? '0 2px 8px 0 rgba(0,0,0,0.04)' : 'none',
                zIndex: isActive ? 1 : 0,
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: isActive ? theme.palette.background.paper : 'rgba(0,0,0,0.04)',
                },
              }}
            >
              <Typography variant="subHeader" sx={{ textTransform: 'none' }}>
                {label}
              </Typography>
            </Button>
          );
        })}
      </Box>
      <Outlet />
    </Box>
  );
}
