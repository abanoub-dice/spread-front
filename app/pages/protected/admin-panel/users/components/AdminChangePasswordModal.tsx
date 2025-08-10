import { Modal, Box, Typography, Button, useTheme, IconButton, DialogTitle } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';

import { useLoaderStore } from '~/utils/store/zustandHooks';
import { axiosInstance } from '~/utils/api/axiosInstance';
import { TextField } from '~/components/form/TextField';
import { useToaster } from '~/components/Toaster';
import CloseIcon from '@mui/icons-material/Close';

const schema = yup.object().shape({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

type AdminChangePasswordFormData = {
  password: string;
  confirmPassword: string;
};

interface AdminChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

export default function AdminChangePasswordModal({
  open,
  onClose,
  userId,
}: AdminChangePasswordModalProps) {
  const { showLoader, hideLoader } = useLoaderStore();
  const theme = useTheme();
  const { showToaster } = useToaster();
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<AdminChangePasswordFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const changePasswordMutation = useMutation({
    mutationFn: (data: { password: string }) => axiosInstance.put(`/v1/admin/users/${userId}`, data),
    onMutate: () => {
      showLoader();
    },
    onSuccess: () => {
      hideLoader();
      showToaster('User password changed successfully', 'success');
      handleClose();
    },
    onError: (error: any) => {
      hideLoader();
      showToaster(error.response?.data?.message || 'Failed to change user password', 'error');
    },
  });

  const onSubmit = (data: AdminChangePasswordFormData) => {
    changePasswordMutation.mutate({ password: data.password });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="admin-change-password-modal"
      aria-describedby="admin-change-password-form"
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
            variant="formHeader"
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
            Change User Password
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
                name="password"
                register={register}
                label="New Password"
                type="password"
                error={errors.password?.message}
                placeholder="Enter new password"
                isRequired
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
                placeholder="Confirm new password"
                isRequired
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
