import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TextField } from '~/components/form/TextField';
import { FormButton } from '~/components/form/FormButton';
import { sendResetLink } from '~/utils/api/authApis';
import { useToaster } from '~/components/Toaster';
import Turnstile from 'react-turnstile';
import { useState } from 'react';

const schema = yup
  .object({
    email: yup
      .string()
      .required('Email is required')
      .matches(/^[a-zA-Z0-9._%+-]{2,}@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,}$/, 'Invalid email format'),
    turnstileToken: yup.string().required('Please complete the security check'),
  })
  .required();

type ForgotPasswordFormData = yup.InferType<typeof schema>;

export function meta() {
  return [
    { title: 'Forgot Password' },
    { name: 'description', content: 'Get a reset link to your email' },
  ];
}

export default function ForgotPassword({ userType }: { userType: 'dicer' | 'client' }) {
  const { showToaster } = useToaster();
  const [turnstileToken, setTurnstileToken] = useState<string>('');

  // Get Turnstile site key from environment
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ForgotPasswordFormData & { turnstileToken: string }>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });

  const resetLinkMutation = useMutation({
    mutationFn: (data: { email: string; turnstileToken: string }) => sendResetLink(data, userType),
    onSuccess: _ => {
      showToaster('Check your email for password reset instructions', 'success');
      // Clear the entire form on success
      reset();
    },
    onError: _ => {
      showToaster('Failed to send reset link. Please try again.', 'error');
      // Keep the email but clear the turnstile token for retry
      setValue('turnstileToken', '');
      setTurnstileToken('');
    },
  });

  const onSubmit = (data: ForgotPasswordFormData & { turnstileToken: string }) => {
    const resetData = {
      email: data.email,
      turnstileToken: data.turnstileToken || turnstileToken,
    };

    resetLinkMutation.mutate(resetData);
  };

  const navigate = useNavigate();

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
        Forgot Password?
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
          placeholder="Email"
          error={errors.email?.message}
          register={register}
          autoComplete="email"
          showPasswordToggle={false}
        />

        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="bodyRegular" component="span">
            Back to{'  '}
            <Box
              component="span"
              sx={{
                color: 'primary.main',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
              onClick={() => navigate(`/${userType}/login`)}
            >
              Login?
            </Box>
          </Typography>
        </Box>

        {/* Hidden input for turnstile token validation */}
        <input type="hidden" {...register('turnstileToken')} value={turnstileToken} />

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

        <FormButton label="Confirm Email" isLoading={resetLinkMutation.isPending} sx={{ mt: 2 }} />
      </Box>
    </Box>
  );
}
