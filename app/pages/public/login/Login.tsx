import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { Box, Typography, useTheme } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField } from '~/components/form/TextField';
import { FormButton } from '~/components/form/FormButton';
import { userLogin } from '~/utils/api/authApis';
import type { LoginCredentials } from '~/utils/interfaces/user';
import { useAppDispatch } from '~/utils/store/hooks/hooks';
import { setUser } from '~/utils/store/slices/userSlice';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '~/utils/api/axiosInstance';
import { useToaster } from '~/components/Toaster';

const schema = yup
  .object({
    email: yup
      .string()
      .required('Email is required')
      .matches(/^[a-zA-Z0-9._%+-]{2,}@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,}$/, 'Invalid email format'),
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters'),
  })
  .required();

export function meta() {
  return [{ title: 'Login' }, { name: 'description', content: 'Login to your account' }];
}

export default function LoginForm() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToaster } = useToaster();

  // Determine user type from URL path
  const userType = location.pathname.includes('/dicer/') ? 'dicer' : 'client';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginCredentials) => userLogin({ ...data, userType }),
    onSuccess: data => {
      dispatch(setUser({ user: data.user, token: data.access_token }));
      // Navigate based on user type
      const redirectPath = userType === 'client' ? '/client' : '/';
      navigate(redirectPath, { replace: true });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      showToaster(error.response?.data?.message || 'Failed to login', 'error');
    },
  });

  const onSubmit = (data: LoginCredentials) => {
    loginMutation.mutate(data);
  };

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
        Sign In
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ mt: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TextField
          label="Email Address"
          name="email"
          type="email"
          placeholder="Enter your email"
          error={errors.email?.message}
          register={register}
          isRequired
          autoComplete="email"
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          register={register}
          isRequired
          autoComplete="current-password"
          showPasswordToggle
        />

        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="caption" component="span">
            Forgot your password?{' '}
            <Box
              component="span"
              sx={{
                color: 'primary.main',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                  color: 'primary.dark',
                },
              }}
              onClick={() => navigate(`/${userType}/forgot-password`)}
            >
              Reset it here
            </Box>
          </Typography>
        </Box>

        <FormButton label="Sign in" isLoading={loginMutation.isPending} />
      </Box>
    </>
  );
}
