import { Button } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { useEffect, useState } from 'react';

const useLoadingDots = () => {
  const [dots, setDots] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return dots;
};

interface FormButtonProps {
  label: string;
  isLoading?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  onClick?: () => void;
  sx?: SxProps<Theme>;
}

export const FormButton = ({
  label,
  isLoading = false,
  fullWidth = true,
  type = 'submit',
  variant = 'contained',
  color = 'primary',
  onClick,
  sx,
}: FormButtonProps) => {
  const dots = useLoadingDots();

  return (
    <Button
      type={type}
      fullWidth={fullWidth}
      variant={variant}
      color={color}
      disabled={isLoading}
      onClick={onClick}
      sx={{
        textTransform: 'inherit',
        ...sx,
      }}
    >
      {isLoading ? `Loading${dots}` : label}
    </Button>
  );
}; 