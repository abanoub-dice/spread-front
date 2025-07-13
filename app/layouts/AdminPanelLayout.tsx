import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaUsersCog } from 'react-icons/fa';
import { TbCategory2 } from 'react-icons/tb';
import { MdInventory2 } from 'react-icons/md';
import { Box, Container, Tab, Tabs, styled } from '@mui/material';
import { useAppSelector } from '~/utils/store/hooks/hooks';
import { UserRole } from '~/utils/interfaces/role';
import { ADMIN_ROUTES } from '~/routes';

// Tab configuration
const ADMIN_TABS = [
  {
    label: 'Users',
    value: ADMIN_ROUTES.USERS,
    icon: <FaUsersCog />,
  },
  {
    label: 'Projects Categories',
    value: ADMIN_ROUTES.PROJECT_CATEGORIES,
    icon: <TbCategory2 />,
  },
  {
    label: 'Items Categories',
    value: ADMIN_ROUTES.PRODUCTION_ITEMS,
    icon: <MdInventory2 />,
  },
] as const;

const StyledTabs = styled(Tabs)({
  borderBottom: '1px solid #e8e8e8',
  '& .MuiTabs-indicator': {
    backgroundColor: 'primary.main',
  },
});

const StyledTab = styled(Tab)({
  textTransform: 'none',
  minWidth: 0,
  minHeight: '50px',
  padding: '4px 12px',
  '&.Mui-selected': {
    color: 'primary.main',
  },
  '&:hover': {
    color: 'primary.main',
    opacity: 0.7,
  },
});

export default function AdminPanelLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector(state => state.user.data);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!user) {
      return;
    }

    setIsChecking(false);

    if (user.role !== UserRole.ADMIN) {
      navigate('/', { replace: true });
      return;
    }

    if (location.pathname === ADMIN_ROUTES.BASE) {
      navigate(ADMIN_ROUTES.USERS);
    }
  }, [location.pathname, navigate, user]);

  if (isChecking) {
    return null;
  }

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  // Get active tab value based on current path
  const getActiveTabValue = () => {
    const currentPath = location.pathname;
    return ADMIN_TABS.find(tab => 
      currentPath === tab.value || currentPath.includes(tab.value)
    )?.value || false;
  };

  return (
    <>
      <Box sx={{ border: 1, borderColor: 'divider', width: '100%' }}>
        <Container>
          <StyledTabs
            value={getActiveTabValue()}
            onChange={handleTabChange}
            aria-label="admin navigation tabs"
          >
            {ADMIN_TABS.map(tab => (
              <StyledTab
                key={tab.value}
                icon={tab.icon}
                iconPosition="start"
                label={tab.label}
                value={tab.value}
              />
            ))}
          </StyledTabs>
        </Container>
      </Box>
      <Box sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </>
  );
}
