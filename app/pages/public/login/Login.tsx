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
import { UserType, UserRole } from '~/utils/interfaces/user';
import { useUserStore } from '~/utils/store/zustandHooks';
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
  const { setUser } = useUserStore();
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
    // resolver: yupResolver(schema),  // TODO: Uncomment this when API is ready
    mode: 'onChange',
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginCredentials) => userLogin({ ...data, userType }),
    onSuccess: data => {
      setUser(data.user, data.access_token);
      // Navigate based on user type
      const redirectPath = userType === 'client' ? '/client' : '/';
      navigate(redirectPath, { replace: true });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      showToaster(error.response?.data?.message || 'Failed to login', 'error');
    },
  });

  const onSubmit = (data: LoginCredentials) => {
    // TODO: Uncomment this when API is ready
    // loginMutation.mutate(data);

    const mockToken = 'mock-jwt-token-12345';

    if (userType === 'dicer') {
      // Use dicer user mock data
      const dicerUser = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@dicema.com',
        type: UserType.DICER,
        created_at: '2025-04-14T14:12:34.000000Z',
        updated_at: '2025-04-24T13:11:29.000000Z',
        role: UserRole.ADMIN,
      };
      setUser(dicerUser, mockToken);
      navigate('/dicer', { replace: true });
      showToaster('Login successful!', 'success');
    } else {
      // Use client user mock data
      const clientUser = {
        id: 2,
        name: 'Sarah Johnson',
        email: 'amir.haroun@dicema.com',
        phone: '+15415190190',
        account_id: 1,
        deleted_at: null,
        created_at: '2025-04-14T14:12:34.000000Z',
        updated_at: '2025-04-24T13:11:29.000000Z',
        type: UserType.CLIENT,
      };
      setUser(clientUser, mockToken);
      navigate('/client', { replace: true });
      showToaster('Login successful!', 'success');
    }
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
          label="email"
          error={errors.email?.message}
          register={register}
          autoComplete="email"
          showPasswordToggle={false}
        />

        <TextField
          name="password"
          type="password"
          label="password"
          error={errors.password?.message}
          register={register}
          autoComplete="current-password"
          showPasswordToggle
        />

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

        <FormButton label="Log In" isLoading={loginMutation.isPending} sx={{ mt: 2 }} />
      </Box>
    </Box>
  );
}
