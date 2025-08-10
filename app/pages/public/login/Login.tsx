import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TextField } from '~/components/form/TextField';
import { FormButton } from '~/components/form/FormButton';
import { userLogin } from '~/utils/api/authApis';
import type { LoginCredentials } from '~/utils/interfaces/user';
import { useUserStore } from '~/utils/store/zustandHooks';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '~/utils/api/axiosInstance';
import { useToaster } from '~/components/Toaster';
import Turnstile from 'react-turnstile';
import { useState } from 'react';

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
    turnstileToken: yup.string().required('Please complete the security check'),
  })
  .required();

export function meta() {
  return [{ title: 'Login' }, { name: 'description', content: 'Login to your account' }];
}

export default function LoginForm({ userType }: { userType: 'dicer' | 'client' }) {
  const { setUser } = useUserStore();
  const navigate = useNavigate();
  const { showToaster } = useToaster();
  const [turnstileToken, setTurnstileToken] = useState<string>('');

  // Get Turnstile site key from environment
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginCredentials & { turnstileToken: string }>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginCredentials) => userLogin(data, userType as 'dicer' | 'client'),
    onSuccess: data => {
      // Omit the roles array from user data
      const { roles, ...userWithoutRoles } = data.user as any;
      setUser(userWithoutRoles, data.token);
      // Navigate based on user type
      navigate(`/${userType}`, { replace: true });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      showToaster(error.response?.data?.message || 'Failed to login', 'error');
    },
  });

  const onSubmit = (data: LoginCredentials & { turnstileToken: string }) => {
    // Only send email, password, and turnstileToken
    const loginData = {
      email: data.email,
      password: data.password,
      turnstileToken: turnstileToken,
    };

    loginMutation.mutate(loginData);
  };

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
        Welcome back!
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
        <TextField
          name="email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          error={errors.email?.message}
          register={register}
          autoComplete="email"
          showPasswordToggle={false}
        />

        <TextField
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          error={errors.password?.message}
          register={register}
          autoComplete="current-password"
          showPasswordToggle
        />

        {/* Hidden input for turnstile token validation */}
        <input type="hidden" {...register('turnstileToken')} value={turnstileToken} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 1,
          }}
        >
          <Typography
            variant="bodyRegular"
            sx={{
              color: 'primary.main',
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
            onClick={() => navigate(`/${userType}/forgot-password`)}
          >
            Forgot Password?
          </Typography>
        </Box>

        {/* Turnstile Widget */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 2,
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          <Turnstile
            sitekey={siteKey}
            onVerify={token => {
              setTurnstileToken(token);
              setValue('turnstileToken', token);
            }}
            onError={() => {
              setTurnstileToken('');
              setValue('turnstileToken', '');
              showToaster('Security check failed. Please try again.', 'error');
            }}
            onExpire={() => {
              setTurnstileToken('');
              setValue('turnstileToken', '');
            }}
          />
        </Box>
        {errors.turnstileToken && (
          <Typography variant="body2" color="error" sx={{ textAlign: 'center' }}>
            {errors.turnstileToken.message}
          </Typography>
        )}

        <FormButton label="Log In" isLoading={loginMutation.isPending} sx={{ mt: 2 }} />
      </Box>
    </Box>
  );
}
