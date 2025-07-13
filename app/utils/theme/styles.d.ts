import "@mui/material/styles";
import "@mui/material/styles/createPalette";
import { CustomColors } from "./types";
import "@mui/material/Typography";

declare module "@mui/material/styles" {
  interface Palette {
    custom: CustomColors;
    border: {
      primary: string;
      secondary?: string;
      light?: string;
      dark?: string;
    };
  }

  interface PaletteOptions {
    custom: CustomColors;
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
    dark: string;
    darkPaper: string;
    activePrimary: string;
    overlay: string;
    darkGray: string;
  }

  interface TypeText {
    lightText: string;
    black: string;
  }
}

declare module "@mui/material/styles/createPalette" {
  interface TypeBackground {
    dark?: string;
    darkPaper?: string;
    activePrimary?: string;
    overlay?: string;
    darkGray: string;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    paragraph1: true;
    paragraph2: true;
    button1: true;
    button2: true;
    thumbnailTitle: true;
    thumbnailSubtitle1: true;
    thumbnailSubtitle2: true;
    sCaption: true;
    subHeader: true;
  }
}
