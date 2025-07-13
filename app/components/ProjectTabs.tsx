import { Box, Button, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

// Navigation items are static, so define them outside the component
const projectNavItems = [
  { label: 'Project Plan', path: 'project-plan' },
  { label: 'Factory Visits', path: 'factory-visits' },
  { label: 'Action Items', path: 'action-items' },
];

export default function ProjectTabs() {
  const navigate = useNavigate();
  const location = useLocation();


  const projectId = useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    return segments[0] || '';
  }, [location.pathname]);

  // Memoize navigation handler
  const handleNavigate = useCallback(
    (path: string) => {
      navigate(`/${projectId}/${path}`);
    },
    [navigate, projectId]
  );

  return (
    <Box
      sx={{
        display: 'inline-flex',
        width: 'fit-content',
        backgroundColor: 'hsl(210, 40%, 96.1%)',
        borderRadius: 2,
        overflow: 'hidden',
        p: 1, 
      }}
    >
      {projectNavItems.map(({ label, path }) => {
        const isActive = location.pathname.includes(path);
        return (
          <Button
            key={path}
            onClick={() => handleNavigate(path)}
            sx={{
              px: 1,
              py: 0.5,
              color: isActive ? 'text.primary' : 'rgba(0, 0, 0, 0.45)',
              borderRadius: 1,
              backgroundColor: isActive ? 'background.paper' : 'transparent',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: isActive
                  ? 'background.paper'
                  : 'rgba(0, 0, 0, 0.08)',
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
