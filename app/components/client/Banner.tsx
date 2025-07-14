import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const steps = [
  {
    image: '/app/assets/clientBanner/1.png',
    title: 'Review Content',
    description: 'Preview and review content across multiple platforms',
    color: '#2563eb',
    bg: 'rgba(37,99,235,0.1)',
  },
  {
    image: '/app/assets/clientBanner/2.png',
    title: 'Approve/Reject',
    description: 'Quick approval process with clear status indicators',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.1)',
  },
  {
    image: '/app/assets/clientBanner/3.png',
    title: 'Add Comments',
    description: 'Provide detailed feedback and collaborate in real-time',
    color: '#a21caf',
    bg: 'rgba(162,28,175,0.1)',
  },
  {
    image: '/app/assets/clientBanner/4.png',
    title: 'Publish',
    description: 'Send approved content for scheduling and review',
    color: '#f97316',
    bg: 'rgba(249,115,22,0.1)',
  },
];

const Banner: React.FC = () => {
  return (
    <Box
      sx={{
        width: '100%',
        py: 6,
        background: 'linear-gradient(to right, rgba(255, 87, 34, 0.1), rgba(26, 35, 126, 0.1))',
        minHeight: '220px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth={false} sx={{ width: '95%' }}>
        <Typography
          variant="h2"
          align="center"
          sx={{
            mb: 8,
            color: 'text.black',
          }}
        >
          Experience Seamless Collaboration in 4 Simple Steps
        </Typography>
        <Box
          sx={{
            display: { xs: 'none', md: 'block' }, // Hide old flex layout on all screens
          }}
        >
          {/* Old layout hidden, replaced by Grid below */}
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: { xs: 4, md: 2 },
            justifyContent: 'center',
            alignItems: 'stretch',
          }}
        >
          {steps.map(step => (
            <Box
              key={step.title}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                px: { xs: 0, md: 2 },
                mb: { xs: 2, md: 0 },
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 4,
                }}
              >
                <img 
                  src={step.image} 
                  alt={step.title}
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'contain'
                  }}
                />
              </Box>
              <Typography variant="h3" sx={{ color: 'text.black' }}>
                {step.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: 'text.lightText', maxWidth: '220px', textAlign: 'center', mt: 2 }}
              >
                {step.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Banner;

