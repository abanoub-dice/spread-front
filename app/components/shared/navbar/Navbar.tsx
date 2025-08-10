import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDialogueStore, useUserStore } from '~/utils/store/zustandHooks';


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


interface NavbarProps {
  avatarUrl?: string;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ avatarUrl, onLogout }) => {
  // Log user state
  const userState = useUserStore((state) => state.user);
  const setDialogue = useDialogueStore((state) => state.setDialogue);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
    setDialogue({
      show: true,
      title: 'Confirm Logout',
      text: 'Are you sure you want to logout?',
      acceptLabel: 'Logout',
      acceptColor: 'error',
      closable: true,
      onAccept: () => {
        onLogout();
      },
    });
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
        backgroundColor: 'background.darkBlue',
      }}
    >
      <Container
        maxWidth={false}
        disableGutters
        sx={theme => ({
          [theme.breakpoints.up('sm')]: {
            paddingLeft: theme.spacing(2.5),
            paddingRight: theme.spacing(2.5),
          },
        })}
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
                padding: '0',
                color: notificationAnchorEl ? 'primary.main' : 'primary.white',
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
                padding: '0',
                color: userAnchorEl ? 'primary.main' : 'primary.white',
                backgroundColor: userAnchorEl ? 'rgba(254, 82, 10, 0.08)' : 'transparent',
                '&:hover': {
                  backgroundColor: userAnchorEl ? 'rgba(254, 82, 10, 0.12)' : 'rgba(0, 0, 0, 0.04)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {avatarUrl ? (
                <Avatar
                  src={avatarUrl}
                  alt="User avatar"
                  sx={{
                    width: 32,
                    height: 32,
                    border: userAnchorEl ? '2px solid' : 'none',
                    borderColor: userAnchorEl ? 'primary.main' : 'transparent',
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: userAnchorEl ? 'primary.main' : 'primary.white',
                  }}
                >
                  {userAnchorEl ? <IoSettings size={24} /> : <IoSettingsOutline size={24} />}
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
        slotProps={{
          paper: {
            sx: {
              minWidth: 300,
              minHeight: 200,
              mt: 1,
            },
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
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 150,
            },
          },
        }}
      >
        <MenuItem onClick={handleChangePassword}>Change Password</MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
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
