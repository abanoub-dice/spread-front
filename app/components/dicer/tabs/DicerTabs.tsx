import { Box, Button, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';
import { useTheme } from '@mui/material/styles';

// Dicer navigation items
const dicerNavItems = [
  { label: 'Calendar View', path: '/dicer' },
  { label: 'Content Manager', path: '/dicer/content' },
  { label: 'Upload Content', path: '/dicer/upload' },
  { label: 'Insights', path: '/dicer/insights' },
  { label: 'Admin Panel', path: '/dicer/admin' },
];

export default function DicerTabs() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  // Memoize navigation handler
  const handleNavigate = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate]
  );

  return (
    <Box
      sx={{
        display: 'inline-flex',
        width: 'fit-content',
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        overflow: 'hidden',
        p: 0.5,
        border: `1.5px solid ${theme.palette.custom?.lightBorder || '#d7d7d7'}`,
        boxShadow: '0 1px 4px 0 rgba(0,0,0,0.04)',
        my: 3,
      }}
    >
      {dicerNavItems.map(({ label, path }, idx) => {
        const isActive =
          path === '/dicer'
            ? location.pathname === '/dicer' || location.pathname === '/dicer/'
            : location.pathname.startsWith(path);
        return (
          <Button
            key={path}
            onClick={() => handleNavigate(path)}
            disableElevation
            sx={{
              px: 2.5,
              py: 1.2,
              minWidth: 0,
              borderRadius: 0,
              borderRight:
                idx !== dicerNavItems.length - 1
                  ? `1px solid ${theme.palette.custom?.lightBorder || '#d7d7d7'}`
                  : 'none',
              color: isActive
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
              backgroundColor: isActive ? theme.palette.background.paper : 'transparent',
              fontWeight: isActive ? 600 : 400,
              boxShadow: isActive ? '0 2px 8px 0 rgba(0,0,0,0.04)' : 'none',
              zIndex: isActive ? 1 : 0,
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: isActive
                  ? theme.palette.background.paper
                  : 'rgba(0,0,0,0.04)',
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
  );
}
