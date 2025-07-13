// src/theme.ts
import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import palette from './palette';
import { typographyVariants } from './typography';

const themeOptions: ThemeOptions = {
  palette,
  typography: {
    fontFamily: `"Ubuntu", sans-serif`,
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
