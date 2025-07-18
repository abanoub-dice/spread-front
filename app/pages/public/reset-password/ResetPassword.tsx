import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { Box, Typography, useTheme } from '@mui/material';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { TextField } from '~/components/form/TextField';
import { FormButton } from '~/components/form/FormButton';
import { resetPassword } from '~/utils/api/authApis';
import { useToaster } from '~/components/Toaster';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '~/utils/api/axiosInstance';

const schema = yup
  .object({
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: yup
      .string()
      .required('Please confirm your password')
      .min(8, 'Password must be at least 8 characters')
      .oneOf([yup.ref('password')], 'Passwords must match'),
  })
  .required();

type ResetPasswordFormData = yup.InferType<typeof schema>;

export function meta() {
  return [{ title: 'Reset Password' }, { name: 'description', content: 'Reset your password' }];
}

export default function ResetPassword() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { showToaster } = useToaster();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const location = useLocation();
  const userType = location.pathname.includes('/dicer/') ? 'dicer' : 'client';
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordFormData) => {
      if (!token) {
        showToaster('please use the link provided in the email', 'error');
        navigate(`/${userType}/forgot-password`, { replace: true });
      }
      return resetPassword({ token: token as string, password: data.password });
    },
    onSuccess: () => {
      showToaster('Password has been reset successfully', 'success');
      navigate(`/${userType}/login`, { replace: true });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      showToaster(error.response?.data?.message || 'Failed to reset password', 'error');
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPasswordMutation.mutate(data);
  };

  if (!token) {
    return (
      <Typography color="error" sx={{ mt: 2 }}>
        Invalid or missing reset token. Please request a new password reset link.
      </Typography>
    );
  }

  return (
    <>
      <Typography
        component="h1"
        variant="formHeader"
        sx={{
          my: 2,
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
        Reset Password
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ mt: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TextField
          label="New Password"
          name="password"
          type="password"
          placeholder="Enter your new password"
          error={errors.password?.message}
          register={register}
          isRequired
          autoComplete="new-password"
          showPasswordToggle
        />

        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your new password"
          error={errors.confirmPassword?.message}
          register={register}
          isRequired
          autoComplete="new-password"
          showPasswordToggle
        />
        <Box sx={{ mt: 2 }}>
          <FormButton label="Reset Password" isLoading={resetPasswordMutation.isPending} />
        </Box>
      </Box>
    </>
  );
}
