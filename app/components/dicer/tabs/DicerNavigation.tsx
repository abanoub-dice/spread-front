import { Box, Button, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import { useAppSelector } from '~/utils/store/hooks/hooks';
import { getUser } from '~/utils/store/slices/userSlice';
import { UserRole, UserType } from '~/utils/interfaces/user';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import BarChartIcon from '@mui/icons-material/BarChart';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

// Dicer navigation items with icons
const dicerNavItems = [
  { label: 'Calendar View', path: '/dicer', icon: CalendarTodayIcon },
  { label: 'Content Manager', path: '/dicer/content', icon: DescriptionIcon },
  { label: 'Upload Content', path: '/dicer/upload', icon: CloudUploadIcon },
  { label: 'Insights', path: '/dicer/insights', icon: BarChartIcon },
  { label: 'Social Analytics', path: '/dicer/social-analytics', icon: AnalyticsIcon },
  { label: 'Admin Panel', path: '/dicer/admin', icon: AdminPanelSettingsIcon },
];

export default function DicerNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { user } = useAppSelector(getUser);

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
            startIcon={<Icon />}
            sx={{
              justifyContent: 'flex-start',
              px: 1.5,
              py: 1.5,
              borderRadius: 2,
              color: isActive
                ? theme.palette.primary.main
                : theme.palette.text.light,
              backgroundColor: isActive 
                ? 'rgba(254, 106, 0, 0.1)' // Light orange background for active state
                : 'transparent',
              border: 'none',
              textTransform: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: isActive
                  ? 'rgba(254, 106, 0, 0.15)'
                  : 'rgba(0,0,0,0.04)',
                color: isActive
                  ? theme.palette.primary.main
                  : theme.palette.text.dark,
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