// src/theme.ts
import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import palette from './palette';
import { typographyVariants } from './typography';

const themeOptions: ThemeOptions = {
  palette,
  typography: {
    fontFamily: `ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
    ...typographyVariants,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
        },
      },
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;
