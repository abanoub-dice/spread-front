import { Box, OutlinedInput, Typography } from '@mui/material';
import React, { useCallback } from 'react';

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  disabled?: boolean;
}

export default function QuantityInput(props: QuantityInputProps) {
  const {
    value,
    onChange,
    min = 1,
    max = 999999,
    label = 'Quantity',
    disabled = false,
  } = props;

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = event.target;
    if (inputValue === '') {
      onChange(min);
      return;
    }
    const newValue = parseInt(inputValue, 10);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  }, [min, max, onChange]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, width: '100%' }}>
      <Typography variant="subHeader" sx={{ ml: 1, mb: 0.5 }}>
        {label}
        <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>
          *
        </Box>
      </Typography>
      <OutlinedInput
        type="number"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        inputProps={{
          min,
          max,
          style: { textAlign: 'left', padding: '8px 8px 8px 16px' },
        }}
        sx={{
          '& .MuiInputBase-input': {
            fontSize: { xs: '0.75rem', sm: '0.8125rem', md: '0.875rem' },
            padding: '8px 16px',
            '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
              opacity: 1,
              paddingY: '4px',
              cursor: 'pointer',
              '&:hover': {
                fill: 'red',
              },
            },
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
          },
        }}
      />
    </Box>
  );
}
