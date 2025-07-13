import type { PaletteColorOptions, PaletteOptions, TypeBackground, TypeText } from '@mui/material';
export interface CustomColors {
  stroke: string;
  darkContrastText: string;
  lightBorder: string;
}

export const primaryColor: PaletteColorOptions = {
  main: '#fe520a',
};

export const secondaryColor: PaletteColorOptions = {
  main: '#535863',
};

export const backgroundColor: Partial<TypeBackground> = {
  default: '#fff',
  paper: '#FAFAFA',
  dark: '#000',
};

export const customColors: Partial<CustomColors> = {
  stroke: '#000',
  lightBorder: '#d7d7d7',
};

export const text: Partial<TypeText> = {
  primary: '#3F3F46',
  secondary: '#535863',
  lightText: '#4b5563',
  black: '#000',
};

const paletteOptions: PaletteOptions = {
  primary: primaryColor,
  secondary: secondaryColor,
  background: backgroundColor,
  custom: customColors,
  text,
};

export default paletteOptions;
