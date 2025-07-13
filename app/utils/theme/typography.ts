import type { TypographyVariantsOptions } from '@mui/material/styles';
import type { TypographyPropsVariantOverrides } from '@mui/material/Typography';

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    formHeader: true;
    paragraph1: true;
  }
}

// Define each variant as a constant
export const h1 = {
  fontSize: '20px',
  lineHeight: '28px',
  fontWeight: 700,
  fontStyle: 'normal',
  '@media (max-width:1024px)': {
    fontSize: '18px',
    lineHeight: '26px',
  },
  '@media (max-width:687px)': {
    fontSize: '17px',
    lineHeight: '24px',
  },
};

export const h2 = {
  fontSize: '18px',
  fontStyle: 'normal',
  fontWeight: 600,
  lineHeight: '28px',
  '@media (max-width:1024px)': {
    fontSize: '16px',
    lineHeight: '26px',
  },
  '@media (max-width:687px)': {
    fontSize: '15px',
    lineHeight: '24px',
  },
};

export const h3 = {
  fontSize: '15px',
  fontStyle: 'normal',
  fontWeight: 700,
  lineHeight: 'normal',
  '@media (max-width:1024px)': {
    fontSize: '13px',
  },
  '@media (max-width:687px)': {
    fontSize: '12px',
  },
};

export const h4 = {
  fontSize: '28px',
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: 'normal',
  '@media (max-width:1024px)': {
    fontSize: '26px',
  },
  '@media (max-width:687px)': {
    fontSize: '25px',
  },
};

export const h5 = {
  fontSize: '1.062rem',
  fontStyle: 'normal',
  fontWeight: 500,
  lineHeight: 'normal',
  '@media (max-width:1024px)': {
    fontSize: '1rem',
  },
  '@media (max-width:687px)': {
    fontSize: '0.9375rem',
  },
};

export const textField = {
  fontSize: '0.875rem',
  fontStyle: 'normal',
  fontWeight: 300,
  lineHeight: '1.25',
  '@media (max-width:1024px)': {
    fontSize: '0.8125rem',
  },
  '@media (max-width:687px)': {
    fontSize: '0.75rem',
  },
};

export const button = {
  fontSize: '14px',
  fontStyle: 'normal',
  fontWeight: 500,
  lineHeight: '20px',
  '@media (max-width:1024px)': {
    fontSize: '12px',
    lineHeight: '18px',
  },
  '@media (max-width:687px)': {
    fontSize: '11px',
    lineHeight: '16px',
  },
};

export const subHeader = {
  fontSize: '14px',
  fontStyle: 'normal',
  fontWeight: 500,
  lineHeight: '20px',
  '@media (max-width:1024px)': {
    fontSize: '12px',
    lineHeight: '18px',
  },
  '@media (max-width:687px)': {
    fontSize: '11px',
    lineHeight: '16px',
  },
};

export const body1 = {
  fontSize: '14px',
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: '16px',
  '@media (max-width:1024px)': {
    fontSize: '12px',
    lineHeight: '15px',
  },
  '@media (max-width:687px)': {
    fontSize: '11px',
    lineHeight: '14px',
  },
};

export const caption = {
  fontSize: '12px',
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: '16px',
  '@media (max-width:1024px)': {
    fontSize: '10px',
    lineHeight: '14px',
  },
  '@media (max-width:687px)': {
    fontSize: '9px',
    lineHeight: '12px',
  },
};

export const formHeader = {
  fontSize: '24px',
  fontStyle: 'normal',
  fontWeight: 900,
  lineHeight: '32px',
  color: 'primary.main',
  '@media (max-width:1024px)': {
    fontSize: '22px',
    lineHeight: '30px',
  },
  '@media (max-width:687px)': {
    fontSize: '21px',
    lineHeight: '28px',
  },
};

// Combine all variants into one object to export
export const typographyVariants: TypographyVariantsOptions = {
  h1,
  h2,
  h3,
  h4,
  h5,
  textField,
  caption,
  subHeader,
  button,
  formHeader,
  body1
};
