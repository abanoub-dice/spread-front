import { Box, Button, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import { useUserStore } from '~/utils/store/zustandHooks';
import { UserRole } from '~/utils/interfaces/user';
import {
  Calendar2,
  DocumentUpload,
  DocumentText,
  Chart2,
  ChartCircle,
  Crown1,
} from 'iconsax-reactjs';

// Dicer navigation items with icons
const dicerNavItems = [
  { label: 'Calendar View', path: '/dicer', icon: Calendar2 },
  { label: 'Content Manager', path: '/dicer/content', icon: DocumentText },
  { label: 'Upload Content', path: '/dicer/upload', icon: DocumentUpload },
  { label: 'Insights', path: '/dicer/insights', icon: Chart2 },
  { label: 'Social Analytics', path: '/dicer/social-analytics', icon: ChartCircle },
  { label: 'Admin Panel', path: '/dicer/admin', icon: Crown1 },
];

export default function DicerNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const user = useUserStore((state) => state.user);

  // Memoize navigation handler
  const handleNavigate = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate]
  );

  // Filter nav items based on user role
  const filteredNavItems = dicerNavItems.filter(item => {
    if (item.label === 'Admin Panel') {
      return user && 'role' in user && user.role === UserRole.ADMIN;
    }
    return true;
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: 1.5,
      }}
    >
      {filteredNavItems.map(({ label, path, icon: Icon }) => {
        const isActive =
          path === '/dicer'
            ? location.pathname === '/dicer' || location.pathname === '/dicer/'
            : location.pathname.startsWith(path);
        return (
          <Button
            key={path}
            onClick={() => handleNavigate(path)}
            disableElevation
            fullWidth
            startIcon={<Icon variant="Bold" />}
            sx={{
              justifyContent: 'flex-start',
              px: 1.5,
              py: 1.5,
              borderRadius: 2,
              color: isActive ? theme.palette.primary.main : theme.palette.text.light,
              backgroundColor: isActive
                ? 'rgba(254, 106, 0, 0.1)' // Light orange background for active state
                : 'transparent',
              border: 'none',
              textTransform: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: isActive ? 'rgba(254, 106, 0, 0.15)' : 'rgba(0,0,0,0.04)',
                color: isActive ? theme.palette.primary.main : theme.palette.text.dark,
              },
              '& .MuiButton-startIcon': {
                color: 'inherit',
                width: 24,
                height: 24,
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: '600',
              }}
            >
              {label}
            </Typography>
          </Button>
        );
      })}
    </Box>
  );
}
