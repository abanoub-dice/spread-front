import React from 'react';
import { Box, Typography, Skeleton } from '@mui/material';

export const DashboardHeaderSkeleton: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: 600,
          color: 'text.primary',
        }}
      >
        Team Dashboard
      </Typography>

      {/* Bordered Container */}
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'custom.lightBorder',
          borderRadius: '8px',
          backgroundColor: 'background.paper',
        }}
      >
        {/* Controls Row */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 3,
            p: 3,
            flexWrap: { xs: 'wrap', md: 'nowrap' },
          }}
        >
          {/* Account Dropdown Skeleton */}
          <Box sx={{ width: { xs: '100%', md: '50%' } }}>
            <Typography
              variant="h3"
              sx={{
                mb: 1,
                ml: 1,
                color: 'text.black',
              }}
            >
              Select Account
            </Typography>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={56}
              sx={{ borderRadius: '10px' }}
            />
          </Box>

          {/* Right side container for picker and button */}
          <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'flex-end',
              gap: 2,
              width: { xs: '100%', md: '50%' },
              justifyContent: { xs: 'stretch', md: 'flex-end' }
            }}
          >
            {/* Month Picker Skeleton */}
            <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
              <Skeleton
                variant="rectangular"
                width={200}
                height={56}
                sx={{ borderRadius: '10px' }}
              />
            </Box>

            {/* Generate Report Button Skeleton */}
            <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
              <Skeleton
                variant="rectangular"
                width={140}
                height={40}
                sx={{ borderRadius: '8px' }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}; 