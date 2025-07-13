import { Chip } from '@mui/material';
import type { ChipProps, SxProps, Theme } from '@mui/material';
import React from 'react';

export const StatusChip: React.FC<StatusChipProps> = ({ label, color, sx = {}, ...props }) => {
  const getAlphaColor = (hex: string, alpha: string = '1A') => {
    if (hex.length === 9) return hex;
    if (hex.length === 4) {
      hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    return hex + alpha;
  };

  const chipSx: SxProps<Theme> = {
    height: 'unset !important',
    display: 'flex',
    alignItems: 'center',
    color: color,
    borderRadius: '10px',
    border: `1px solid ${color}`,
    backgroundColor: getAlphaColor(color),
    '& .MuiChip-label': {
      fontSize: '10px',
      lineHeight: 1,
      padding: '3px 6px',
    },
    ...sx,
  };

  return (
    <Chip
      label={label}
      size="small"
      sx={chipSx}
      {...props}
    />
  );
};

interface StatusChipProps extends Omit<ChipProps, 'color'> {
  label: string;
  color: string;
  sx?: SxProps<Theme>;
} 