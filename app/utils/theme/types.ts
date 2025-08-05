export interface CustomColors {
  // Add any custom color properties here if needed
}

export interface BorderColors {
  // Existing border properties
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
} 