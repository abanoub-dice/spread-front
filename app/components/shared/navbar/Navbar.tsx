import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '~/utils/store/hooks/hooks';
import { getUser } from '~/utils/store/slices/userSlice';
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Container,
  Typography,
  Avatar,
  Badge,
  Divider,
} from '@mui/material';
import { IoNotificationsOutline, IoNotifications } from 'react-icons/io5';
import { IoSettingsOutline, IoSettings } from 'react-icons/io5';
import SpreadLogo from '~/assets/spread-logo.svg';
import ChangePasswordModal from '~/components/ChangePasswordModal';
import Dialog from '~/components/Dialog';
import { setDialogue } from '~/utils/store/slices/dialogueSlice';

interface NavbarProps {
  avatarUrl?: string;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  avatarUrl,
  onLogout,
}) => {
  // Log user state
  const userState = useAppSelector(getUser);
  console.log('Navbar user state:', userState);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleUserClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setNotificationAnchorEl(null);
    setUserAnchorEl(null);
  };

  const handleLogoClick = () => {
    // Determine if we're in client or dicer section based on URL
    if (location.pathname.startsWith('/client')) {
      navigate('/client');
    } else if (location.pathname.startsWith('/dicer')) {
      navigate('/dicer');
    }
  };

  const handleChangePassword = () => {
    setIsChangePasswordModalOpen(true);
    handleClose();
  };

  const handleLogout = () => {
    dispatch(setDialogue({
      show: true,
      title: 'Confirm Logout',
      text: 'Are you sure you want to logout?',
      acceptLabel: 'Logout',
      acceptColor: 'error',
      closable: true,
      onAccept: () => {
        onLogout();
      },
    }));
    handleClose();
  };

  const handleCloseChangePasswordModal = () => {
    setIsChangePasswordModalOpen(false);
  };

  return (
    <AppBar 
      position="static" 
      elevation={1}
      sx={{ 
        backgroundColor: '#fff',
        color: '#333',
        height: 80,
      }}
    >
      <Container 
        maxWidth={false} 
        sx={{ 
          width: '90%',
          height: '100%',
        }}
      >
        <Toolbar 
          sx={{ 
            height: '100%',
            padding: '0 !important',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo Section */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src={SpreadLogo} 
              alt="Spread Logo" 
              style={{ 
                height: 50, 
                cursor: 'pointer',
              }} 
              onClick={handleLogoClick}
            />
          </Box>

          {/* Right Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Notification Icon */}
            <IconButton
              onClick={handleNotificationClick}
              sx={{ 
                color: notificationAnchorEl ? '#fe520a' : '#333',
                backgroundColor: notificationAnchorEl ? 'rgba(254, 82, 10, 0.08)' : 'transparent',
                '&:hover': {
                  backgroundColor: notificationAnchorEl 
                    ? 'rgba(254, 82, 10, 0.12)' 
                    : 'rgba(0, 0, 0, 0.04)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <Badge badgeContent={0} color="error">
                {notificationAnchorEl ? (
                  <IoNotifications size={24} />
                ) : (
                  <IoNotificationsOutline size={24} />
                )}
              </Badge>
            </IconButton>

            {/* User Avatar */}
            <IconButton
              onClick={handleUserClick}
              sx={{ 
                color: userAnchorEl ? '#fe520a' : '#333',
                backgroundColor: userAnchorEl ? 'rgba(254, 82, 10, 0.08)' : 'transparent',
                '&:hover': {
                  backgroundColor: userAnchorEl 
                    ? 'rgba(254, 82, 10, 0.12)' 
                    : 'rgba(0, 0, 0, 0.04)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {avatarUrl ? (
                <Avatar 
                  src={avatarUrl} 
                  alt="User avatar"
                  sx={{ 
                    width: 40, 
                    height: 40,
                    border: userAnchorEl ? '2px solid #fe520a' : 'none',
                  }}
                />
              ) : (
                <Box sx={{ 
                  width: 40, 
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: userAnchorEl ? '#fe520a' : '#333',
                }}>
                  {userAnchorEl ? (
                    <IoSettings size={24} />
                  ) : (
                    <IoSettingsOutline size={24} />
                  )}
                </Box>
              )}
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Notification Menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            minWidth: 300,
            minHeight: 200,
            mt: 1,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No notifications at the moment
          </Typography>
        </Box>
      </Menu>

      {/* User Menu */}
      <Menu
        anchorEl={userAnchorEl}
        open={Boolean(userAnchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 150,
          },
        }}
      >
        <MenuItem 
          onClick={handleChangePassword}
        >
          Change Password
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={handleLogout}
        >
          Logout
        </MenuItem>
      </Menu>

      {/* Change Password Modal */}
      <ChangePasswordModal
        open={isChangePasswordModalOpen}
        onClose={handleCloseChangePasswordModal}
      />

      {/* Dialog */}
      <Dialog />
    </AppBar>
  );
};

export default Navbar;
