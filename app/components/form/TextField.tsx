import { OutlinedInput, Typography, Box, InputAdornment, IconButton } from '@mui/material';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { useState } from 'react';
import type { UseFormRegister } from 'react-hook-form';

interface TextFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  error?: string;
  register: UseFormRegister<any>;
  isRequired?: boolean;
  autoComplete?: string;
  showPasswordToggle?: boolean;
  disabled?: boolean;
}

export const TextField = ({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  register,
  isRequired = false,
  autoComplete,
  showPasswordToggle = false,
  disabled = false,
}: TextFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="subHeader" sx={{ ml: 1 }}>
        {label}
        {isRequired && <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>*</Box>}
      </Typography>
      <OutlinedInput
        fullWidth
        type={showPasswordToggle ? (showPassword ? 'text' : 'password') : type}
        id={name}
        autoComplete={autoComplete}
        error={!!error}
        placeholder={placeholder}
        disabled={disabled}
        {...register(name)}
        endAdornment={
          showPasswordToggle ? (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                sx={{
                  '&:hover': {
                    backgroundColor: 'transparent',
                    '& svg': {
                      color: 'primary.main',
                    },
                  },
                  '& svg': {
                    color: 'text.secondary',
                    transition: 'color 0.2s',
                  },
                }}
              >
                {showPassword ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
              </IconButton>
            </InputAdornment>
          ) : null
        }
        sx={{
          mt: 1,
          '& .MuiInputBase-input': { 
            fontSize: { xs: '0.75rem', sm: '0.8125rem', md: '0.875rem' }, 
            padding: '10px 16px' 
          },
          '& .MuiInputBase-input::placeholder': { 
            fontSize: { xs: '0.625rem', sm: '0.6875rem', md: '0.75rem' } 
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            '&.Mui-error': {
              '& fieldset': {
                borderColor: 'error.main',
              },
              '&:hover fieldset': {
                borderColor: 'error.main',
              },
            },
          },
        }}
      />
      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}; 