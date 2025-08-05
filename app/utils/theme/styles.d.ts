import '@mui/material/styles';
import '@mui/material/styles/createPalette';
import { CustomColors } from './types';
import '@mui/material/Typography';

declare module '@mui/material/styles' {
  interface Palette {
    custom: CustomColors;
    border: {
      primary: string;
      secondary?: string;
      light?: string;
      dark?: string;
      // Neutral borders
      neutral: string;
      neutralSecondary: string;
      neutralInverse: string;
      // Brand borders
      brand: string;
      brandInverse: string;
      // Semantic borders
      success: string;
      successInverse: string;
      warning: string;
      warningInverse: string;
      error: string;
      errorInverse: string;
      info: string;
      infoInverse: string;
    };
  }

  interface TypographyVariants {
    paragraph1: React.CSSProperties;
    paragraph2: React.CSSProperties;
    button1: React.CSSProperties;
    button2: React.CSSProperties;
    thumbnailTitle: React.CSSProperties;
    thumbnailSubtitle1: React.CSSProperties;
    thumbnailSubtitle2: React.CSSProperties;
    sCaption: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    textField?: React.CSSProperties;
    subHeader?: React.CSSProperties;
    formHeader?: React.CSSProperties;
  }

  interface TypeBackground {
    default: string;
    defaultSecondary: string;
    defaultTertiary: string;
    brand: string;
    brandSecondary: string;
    brandTertiary: string;
    disabled: string;
    darkBlue: string;
  }

  interface TypeText {
    light: string;
    dark: string;
    gray: string;
    brand: string;
    white: string;
  }

  interface TypeSemantic {
    success: string;
    successBg: string;
    warning: string;
    warningBg: string;
    error: string;
    errorBg: string;
    info: string;
    infoBg: string;
    disabled: string;
  }
}

declare module '@mui/material/styles/createPalette' {
  interface PaletteOptions {
    border?: {
      primary: string;
      secondary?: string;
      light?: string;
      dark?: string;
      // Neutral borders
      neutral: string;
      neutralSecondary: string;
      neutralInverse: string;
      // Brand borders
      brand: string;
      brandInverse: string;
      // Semantic borders
      success: string;
      successInverse: string;
      warning: string;
      warningInverse: string;
      error: string;
      errorInverse: string;
      info: string;
      infoInverse: string;
    };
  }
}