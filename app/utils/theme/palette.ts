import type { PaletteColorOptions, PaletteOptions, TypeBackground, TypeSemantic, TypeText } from '@mui/material';

export const primary: PaletteColorOptions = {
  main: '#FE6A00',
  white: '#fff',
};

export const secondary: PaletteColorOptions = {
  main: '#535863',
};

export const backgroundColor: Partial<TypeBackground> = {
  default: '#fff',
  defaultSecondary: '#F7F1ED',
  defaultTertiary: '#D8D1CD',
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

const paletteOptions: PaletteOptions = {
  primary,
  secondary,
  background: backgroundColor,
  text,
  semantic,
};

export default paletteOptions;
