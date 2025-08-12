import {
  OutlinedInput,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  FormControl,
} from '@mui/material';
import { Eye, EyeSlash } from 'iconsax-reactjs';

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
  placeholder?: string;
  startAdornment?: React.ReactNode;
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
  placeholder,
  startAdornment,
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
        {showPassword ? <EyeSlash /> : <Eye />}
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
        <OutlinedInput
          id={name}
          type={showPasswordToggle ? (showPassword ? 'text' : 'password') : type}
          autoComplete={autoComplete}
          disabled={disabled}
          placeholder={placeholder}
          {...register(name)}
          startAdornment={startAdornment}
          endAdornment={endAdornment || passwordToggle}
          error={!!error}
          sx={{
            backgroundColor: 'background.defaultSecondary',
            borderRadius: '8px',
            minHeight: '54px',
            '& .MuiInputBase-input': {
              fontSize: { xs: '0.875rem', sm: '0.875rem', md: '0.875rem' },
              padding: label ? '16px 16px 8px 16px' : '16px',
              color: '#000',
              '&::placeholder': {
                color: 'text.dark',
                fontSize: '0.875rem',
                opacity: 1,
              },
              '&:focus::placeholder': {
                opacity: 0,
              },
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#D5D5DF',
              borderWidth: '1px',
              borderStyle: 'solid',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#D5D5DF',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
              borderWidth: '1px',
            },
            '&.Mui-error': {
              backgroundColor: 'semantic.errorBg',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'error',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'semantic.error',
              },
            },
          }}
        />
        {label && (
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              top: '8px',
              left: '16px',
              color: '#666',
              fontSize: '0.75rem',
              fontWeight: 400,
              zIndex: 1,
              pointerEvents: 'none',
            }}
          >
            {label}
          </Typography>
        )}
      </FormControl>
      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};
