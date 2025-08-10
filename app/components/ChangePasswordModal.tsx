import { Modal, Box, Typography, Button, useTheme, IconButton, DialogTitle } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { useLoaderStore } from '~/utils/store/zustandHooks';
import { useUserStore } from '~/utils/store/zustandHooks';
import { axiosInstance } from '~/utils/api/axiosInstance';
import { TextField } from './form/TextField';
import { useToaster } from '~/components/Toaster';

import CloseIcon from '@mui/icons-material/Close';
import { AxiosError } from 'axios';

const schema = yup.object().shape({
  newPassword: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});

type ChangePasswordFormData = {
  newPassword: string;
  confirmPassword: string;
};

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
  const { resetUser } = useUserStore();
  const { showLoader, hideLoader } = useLoaderStore();
  const theme = useTheme();
  const { showToaster } = useToaster();

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const changePasswordMutation = useMutation({
    mutationFn: (data: { newPassword: string }) =>
      axiosInstance.patch('/v1/users/change-password', data),
    onMutate: () => {
      showLoader();
    },
    onSuccess: () => {
      hideLoader();
      showToaster('Password changed successfully', 'success');
      resetUser();
      handleClose();
    },
    onError: (error: AxiosError) => {
      hideLoader();
      showToaster(
        (error.response?.data as { message?: string })?.message || 'Failed to change password',
        'error'
      );
    },
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    changePasswordMutation.mutate({ newPassword: data.newPassword });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="change-password-modal"
      aria-describedby="change-password-form"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <DialogTitle
          sx={{
            px: 0,
            pt: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Typography
            variant="h1"
            sx={{
              position: 'relative',
              color: theme.palette.primary.main,
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: 0,
                width: '100%',
                height: '2px',
                backgroundColor: theme.palette.primary.main,
                borderRadius: '1px',
              },
            }}
          >
            Change Password
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{
              color: theme.palette.grey[500],
              '&:hover': {
                color: theme.palette.grey[700],
              },
            }}
          >
            <CloseIcon sx={{ fontSize: '1rem' }} />
          </IconButton>
        </DialogTitle>
        <Box sx={{ mt: 3 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'none' }}>
              <TextField
                name="username"
                register={register}
                type="text"
                autoComplete="username"
                label="Username"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                name="newPassword"
                register={register}
                label="New Password"
                type="password"
                error={errors.newPassword?.message}
                showPasswordToggle
                autoComplete="new-password"
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <TextField
                name="confirmPassword"
                register={register}
                label="Confirm Password"
                type="password"
                error={errors.confirmPassword?.message}
                showPasswordToggle
                autoComplete="new-password"
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button onClick={handleClose} variant="outlined" sx={{ textTransform: 'capitalize' }}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={changePasswordMutation.isPending}
                sx={{ textTransform: 'capitalize' }}
              >
                Change Password
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Modal>
  );
}
