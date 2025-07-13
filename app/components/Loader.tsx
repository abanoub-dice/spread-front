import React from 'react';
import { styled } from '@mui/material/styles';

export const Loader: React.FC = () => {
  return (
    <Overlay>
      <Spinner>
        {[...Array(8)].map((_, index) => (
          <SpinnerDot key={index} />
        ))}
      </Spinner>
    </Overlay>
  );
};

const Overlay = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
});

const Spinner = styled('div')({
  color: '#fe520a',
  display: 'inline-block',
  position: 'relative',
  width: '80px',
  height: '80px',
});

const SpinnerDot = styled('div')({
  transformOrigin: '40px 40px',
  '@keyframes rotate': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
  animation: 'rotate 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
  '&:after': {
    content: '" "',
    display: 'block',
    position: 'absolute',
    width: '7.2px',
    height: '7.2px',
    borderRadius: '50%',
    background: 'currentColor',
    margin: '-3.6px 0 0 -3.6px',
  },
  '&:nth-child(1)': {
    animationDelay: '-0.036s',
    '&:after': {
      top: '62.62742px',
      left: '62.62742px',
    },
  },
  '&:nth-child(2)': {
    animationDelay: '-0.072s',
    '&:after': {
      top: '67.71281px',
      left: '56px',
    },
  },
  '&:nth-child(3)': {
    animationDelay: '-0.108s',
    '&:after': {
      top: '70.90963px',
      left: '48.28221px',
    },
  },
  '&:nth-child(4)': {
    animationDelay: '-0.144s',
    '&:after': {
      top: '72px',
      left: '40px',
    },
  },
  '&:nth-child(5)': {
    animationDelay: '-0.18s',
    '&:after': {
      top: '70.90963px',
      left: '31.71779px',
    },
  },
  '&:nth-child(6)': {
    animationDelay: '-0.216s',
    '&:after': {
      top: '67.71281px',
      left: '24px',
    },
  },
  '&:nth-child(7)': {
    animationDelay: '-0.252s',
    '&:after': {
      top: '62.62742px',
      left: '17.37258px',
    },
  },
  '&:nth-child(8)': {
    animationDelay: '-0.288s',
    '&:after': {
      top: '56px',
      left: '12.28719px',
    },
  },
}); 