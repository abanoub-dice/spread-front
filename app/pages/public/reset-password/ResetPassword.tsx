import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { Box, Typography } from '@mui/material';
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

export default function ResetPassword({ userType }: { userType: 'dicer' | 'client' }) {
  const navigate = useNavigate();
  const { showToaster } = useToaster();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordFormData) => {
      if (!token || !email) {
        showToaster('Please use the link provided in the email', 'error');
      }
      return resetPassword(
        {
          token: token as string,
          email: email as string,
          password: data.password,
          password_confirmation: data.confirmPassword,
        },
        userType
      );
    },
    onSuccess: () => {
      showToaster('Password has been reset successfully', 'success');
      navigate(`/${userType}/login`, { replace: true });
    },
    onError: (error: AxiosError<any>) => {
      const errorData = error.response?.data?.errors;

      if (errorData && typeof errorData === 'object') {
        // Check if there's a token error
        if (errorData.token && Array.isArray(errorData.token)) {
          const tokenError = errorData.token[0];
          if (
            tokenError &&
            typeof tokenError === 'string' &&
            (tokenError.includes('Invalid') || tokenError.includes('expired'))
          ) {
            showToaster(
              'Invalid or expired reset token. Please request a new password reset link.',
              'error'
            );
            navigate(`/${userType}/forgot-password`, { replace: true });
            return;
          }
        }

        // Handle other validation errors - show each as a separate toast
        const errorMessages = Object.values(errorData).flat();

        errorMessages.forEach((errorMsg: any) => {
          if (typeof errorMsg === 'string') {
            showToaster(errorMsg, 'error');
          }
        });
      } else {
        showToaster('Failed to reset password', 'error');
      }
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPasswordMutation.mutate(data);
  };

  if (!token || !email) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '400px',
          mx: 'auto',
        }}
      >
        <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
          Invalid or missing reset token or email. Please request a new password reset link.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '400px',
        mx: 'auto',
      }}
    >
      {/* Welcome Header */}
      <Typography
        component="h4"
        variant="h4"
        sx={{
          color: '#272220',
          textAlign: 'center',
          mb: 4,
          fontWeight: 600,
        }}
      >
        Reset Password
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {/* Hidden username field for accessibility */}
        <input
          type="text"
          name="username"
          autoComplete="username"
          style={{ display: 'none' }}
          defaultValue={email || ''}
        />

        <TextField
          name="password"
          type="password"
          error={errors.password?.message}
          register={register}
          autoComplete="new-password"
          showPasswordToggle
          placeholder="New Password"
        />

        <TextField
          name="confirmPassword"
          type="password"
          error={errors.confirmPassword?.message}
          register={register}
          autoComplete="new-password"
          showPasswordToggle
          placeholder="Confirm Password"
        />

        <FormButton
          label="Reset Password"
          isLoading={resetPasswordMutation.isPending}
          sx={{ mt: 2 }}
        />
      </Box>
    </Box>
  );
}
