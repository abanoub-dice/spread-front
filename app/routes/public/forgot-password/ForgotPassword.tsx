import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { Box, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TextField } from '~/components/form/TextField';
import { FormButton } from '~/components/form/FormButton';
import { sendResetLink } from '~/utils/api/authApis';
import { useToaster } from '~/components/Toaster';

const schema = yup
  .object({
    email: yup
      .string()
      .required('Email is required')
      .matches(/^[a-zA-Z0-9._%+-]{2,}@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,}$/, 'Invalid email format'),
  })
  .required();

type ForgotPasswordFormData = yup.InferType<typeof schema>;

export function meta() {
  return [{ title: 'Forgot Password' }, { name: 'description', content: 'Get a reset link to your email' }];
}

export default function ForgotPassword() {
  const theme = useTheme();
  const { showToaster } = useToaster();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const resetLinkMutation = useMutation({
    mutationFn: sendResetLink,
    onSuccess: (data) => {
      showToaster('Password reset link has been sent to your email', 'success');
    },
    onError: (error) => {
      showToaster('Failed to send reset link. Please try again.', 'error');
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    resetLinkMutation.mutate(data);
  };

  const navigate = useNavigate();

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
            borderRadius: '1px'
          }
        }}
      >
        Forgot Password
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

        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="caption" component="span">
            Back to{'  '}
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
              onClick={() => navigate('/dicer/login')}
            >
              login?
            </Box>
          </Typography>
        </Box>

        <FormButton 
          label="Send Reset Link" 
          isLoading={resetLinkMutation.isPending}
        />
      </Box>
    </>
  );
}
