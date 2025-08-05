import {
  OutlinedInput,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
} from '@mui/material';
import { HiOutlineEye, HiMiniEyeSlash } from 'react-icons/hi2';

import { useState } from 'react';
import type { UseFormRegister } from 'react-hook-form';
import type { SxProps, Theme } from '@mui/material';

interface TextFieldProps {
  label?: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number';
  error?: string;
  register: UseFormRegister<any>;
  autoComplete?: string;
  showPasswordToggle?: boolean;
  disabled?: boolean;
  endAdornment?: React.ReactNode;
  sx?: SxProps<Theme>;
}

export const TextField = ({
  label,
  name,
  type = 'text',
  error,
  register,
  autoComplete,
  showPasswordToggle = false,
  disabled = false,
  endAdornment,
  sx,
}: TextFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const passwordToggle = showPasswordToggle ? (
    <InputAdornment position="end">
      <IconButton
        aria-label="toggle password visibility"
        onClick={() => setShowPassword(!showPassword)}
        edge="end"
        sx={{ color: 'text.secondary' }}
      >
        {showPassword ? <HiMiniEyeSlash /> : <HiOutlineEye />}
      </IconButton>
    </InputAdornment>
  ) : null;

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <FormControl
        fullWidth
        variant="outlined"
        error={!!error}
        disabled={disabled}
        sx={{ width: '100%' }}
      >
        {label && (
          <InputLabel
            htmlFor={name}
            sx={{
              transform: 'translate(14px, 12px) scale(1)',
              '&.Mui-focused, &.MuiFormLabel-filled': {
                transform: 'translate(14px, -10px) scale(0.75)',
              },
            }}
          >
            {label}
          </InputLabel>
        )}
        <OutlinedInput
          id={name}
          label={label}
          type={showPasswordToggle ? (showPassword ? 'text' : 'password') : type}
          autoComplete={autoComplete}
          disabled={disabled}
          {...register(name)}
          endAdornment={endAdornment || passwordToggle}
          error={!!error}
          sx={{
            backgroundColor: 'background.defaultSecondary',
            borderRadius: '8px',
            '& .MuiInputBase-input': {
              fontSize: { xs: '0.875rem', sm: '0.875rem', md: '0.875rem' },
              padding: '12px 16px',
              color: '#333',
              '&::placeholder': {
                color: '#999',
                fontSize: '0.875rem',
                opacity: 1,
              },
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'border.neutralSecondary',
              borderWidth: '1px',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#ccc',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
              borderWidth: '1px',
            },
            '&.Mui-error': {
              backgroundColor: '#fff5f5',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'error.main',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'error.main',
              },
            },
          }}
        />
      </FormControl>
      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};
