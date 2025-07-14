import React from 'react';
import { Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface StatusBadgeProps {
  status: 'All' | 'Approved' | 'Pending' | 'Rejected' | 'Sponsored';
  selected?: boolean;
  onClick?: () => void;
}

const statusColorMap = {
  All: {
    bg: '#f9fafb',     // gray-50
    color: '#374151',  // gray-700
  },
  Approved: {
    bg: '#d1fae5',     // green-100
    color: '#15803d',  // green-700
  },
  Pending: {
    bg: '#fef9c3',     // yellow-100
    color: '#b45309',  // yellow-700
  },
  Rejected: {
    bg: '#fee2e2',     // red-100
    color: '#b91c1c',  // red-700
  },
  Sponsored: {
    bg: '#f3e8ff',     // purple-100
    color: '#7c3aed',  // purple-700
  },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, selected, onClick }) => {
  const theme = useTheme();
  const { bg, color } = statusColorMap[status];

  return (
    <Button
      type="button"
      variant="contained"
      disableElevation
      onClick={onClick}
      sx={{
        padding: '6px 12px',
        mr: 0.75,
        borderRadius: '999px',
        minWidth: 0,
        backgroundColor: bg,
        color: color,
        boxShadow: 'none',
        textTransform: 'none',
        transition: 'all 0.2s',
        outline: 'none',
        ...(selected && {
          border: `1px solid ${theme.palette.primary.light}`,
        }),
        '&:hover': {
          backgroundColor: bg,
          boxShadow: selected ? `0 0 0 1px ${theme.palette.primary.main}` : 'none',
        },
      }}
    >
      <Typography variant="caption">{status}</Typography>
    </Button>
  );
};

export default StatusBadge; 