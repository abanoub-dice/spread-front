import type { PaletteColorOptions, PaletteOptions, TypeBackground, TypeSemantic, TypeText } from '@mui/material';
import type { BorderColors } from './types';

export const primary: PaletteColorOptions = {
  main: '#FE6A00',
  white: '#fff',
};

export const secondary: PaletteColorOptions = {
  main: '#535863',
};

export const backgroundColor: Partial<TypeBackground> = {
  default: '#fff',
  defaultSecondary: '#F1F1F4',
  defaultTertiary: '#BCBCC5',
  disabled: '#A19B97',
  brand: '#FE6A00',
  brandSecondary: '#FFA268',
  brandTertiary: '#FFD6BB',
  darkBlue: '#000032',
};

export const text: Partial<TypeText> = {
  dark: '#272220',
  light: '#4b5563',
  gray: '#D8D1CD',
  brand: '#CB560A',
  white: '#fff',
};

export const border: BorderColors = {
  // Existing border properties
  primary: '#000000',
  secondary: '#535863',
  light: '#D8D1CD',
  dark: '#272220',
  
  // Neutral borders
  neutral: '#000000',
  neutralSecondary: '#535863',
  neutralInverse: '#FFFFFF',
  
  // Brand borders
  brand: '#FE6A00',
  brandInverse: '#FFFFFF',
  
  // Semantic borders
  success: '#21BD53',
  successInverse: '#FFFFFF',
  warning: '#D47C30',
  warningInverse: '#FFFFFF',
  error: '#ED3838',
  errorInverse: '#FFFFFF',
  info: '#21A2F2',
  infoInverse: '#FFFFFF',
};

export const semantic: Partial<TypeSemantic> = {
  success: '#21BD53',
  successBg: '#E7FDEF',
  warning: '#D47C30',
  warningBg: '#FFF1E5',
  error: '#ED3838',
  errorBg: '#FDE8E8',
  info: '#21A2F2',
  infoBg: '#E7F5FE',
  disabled: '#A19B97',
};

const paletteOptions = {
  primary,
  secondary,
  background: backgroundColor,
  text,
  border,
  semantic,
} as PaletteOptions & { border: BorderColors };

export default paletteOptions;
