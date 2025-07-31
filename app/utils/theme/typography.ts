import type { TypographyVariantsOptions } from '@mui/material/styles';
import type { TypographyPropsVariantOverrides } from '@mui/material/Typography';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    paragraph1: React.CSSProperties;
    bodyLarge: React.CSSProperties;
    bodyRegular: React.CSSProperties;
    bodySmall: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    paragraph1?: React.CSSProperties;
    bodyLarge?: React.CSSProperties;
    bodyRegular?: React.CSSProperties;
    bodySmall?: React.CSSProperties;
    caption?: React.CSSProperties;
    footnote?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    paragraph1: true;
    bodyLarge: true;
    bodyRegular: true;
    bodySmall: true;
    caption: true;
    footnote: true;
  }
}

// Define each variant as a constant
export const h1 = {
  fontSize: '64px',
  lineHeight: '120%',
  fontWeight: 300, // Light weight
  fontStyle: 'normal',
  letterSpacing: '0%',
  '@media (max-width:1024px)': {
    fontSize: '62px',
  },
  '@media (max-width:687px)': {
    fontSize: '60px',
  },
};

export const h2 = {
  fontSize: '48px',
  lineHeight: '120%',
  fontWeight: 300, // Light weight
  fontStyle: 'normal',
  letterSpacing: '0%',
  '@media (max-width:1024px)': {
    fontSize: '46px',
  },
  '@media (max-width:687px)': {
    fontSize: '44px',
  },
};

export const h3 = {
  fontSize: '40px',
  lineHeight: '120%',
  fontWeight: 300, // Light weight
  fontStyle: 'normal',
  letterSpacing: '0%',
  '@media (max-width:1024px)': {
    fontSize: '38px',
  },
  '@media (max-width:687px)': {
    fontSize: '36px',
  },
};

export const h4 = {
  fontSize: '32px',
  lineHeight: '120%',
  fontWeight: 300, // Light weight
  fontStyle: 'normal',
  letterSpacing: '0%',
  '@media (max-width:1024px)': {
    fontSize: '30px',
  },
  '@media (max-width:687px)': {
    fontSize: '28px',
  },
};

export const h5 = {
  fontSize: '24px',
  lineHeight: '120%',
  fontWeight: 300, // Light weight
  fontStyle: 'normal',
  letterSpacing: '0%',
  '@media (max-width:1024px)': {
    fontSize: '22px',
  },
  '@media (max-width:687px)': {
    fontSize: '20px',
  },
};

export const h6 = {
  fontSize: '20px',
  lineHeight: '120%',
  fontWeight: 300, // Light weight
  fontStyle: 'normal',
  letterSpacing: '0%',
  '@media (max-width:1024px)': {
    fontSize: '18px',
  },
  '@media (max-width:687px)': {
    fontSize: '16px',
  },
};

export const bodyLarge = {
  fontSize: '18px',
  lineHeight: '140%',
  fontWeight: 400, // Regular weight
  fontStyle: 'normal',
  letterSpacing: '0%',
  '@media (max-width:1024px)': {
    fontSize: '16px',
  },
  '@media (max-width:687px)': {
    fontSize: '14px',
  },
};

export const bodyRegular = {
  fontSize: '16px',
  lineHeight: '140%',
  fontWeight: 400, // Regular weight
  fontStyle: 'normal',
  letterSpacing: '0%',
  '@media (max-width:1024px)': {
    fontSize: '14px',
  },
  '@media (max-width:687px)': {
    fontSize: '12px',
  },
};

export const bodySmall = {
  fontSize: '14px',
  lineHeight: '140%',
  fontWeight: 400, // Regular weight
  fontStyle: 'normal',
  letterSpacing: '0%',
  '@media (max-width:1024px)': {
    fontSize: '12px',
  },
  '@media (max-width:687px)': {
    fontSize: '10px',
  },
};

export const caption = {
  fontSize: '12px',
  lineHeight: '140%',
  fontWeight: 600, // SemiBold weight
  fontStyle: 'normal',
  letterSpacing: '4%',
  '@media (max-width:1024px)': {
    fontSize: '10px',
  },
  '@media (max-width:687px)': {
    fontSize: '8px',
  },
};

export const footnote = {
  fontSize: '10px',
  lineHeight: '140%',
  fontWeight: 400, // Regular weight
  fontStyle: 'normal',
  letterSpacing: '0%',
  '@media (max-width:1024px)': {
    fontSize: '8px',
  },
  '@media (max-width:687px)': {
    fontSize: '6px',
  },
};

// Combine all variants into one object to export
export const typographyVariants: TypographyVariantsOptions = {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  bodyLarge,
  bodyRegular,
  bodySmall,
  caption,
  footnote,
};
