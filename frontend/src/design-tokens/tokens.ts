export const tokens = {
  color: {
    brand: {
      primary: '#FF6B9D',
      primaryDarken: '#E5558A',
      secondary: '#F8B4C8',
      secondaryDarken: '#F09AB0',
      accent: '#FFB4D0',
    },
    semantic: {
      success: '#4CAF50',
      info: '#42A5F5',
      warning: '#FF9800',
      error: '#EF5350',
    },
    neutral: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#FCE4EC',
      400: '#F8BBD0',
      500: '#F48FB1',
      600: '#F06292',
      700: '#EC407A',
      800: '#E91E63',
      900: '#AD1457',
    },
    light: {
      background: '#FFF5F7',
      surface: '#FFFFFF',
      surfaceMuted: '#FFF0F3',
      text: '#2D1B2E',
      textMuted: '#8A6B7A',
      border: '#FADBE8',
      track: '#FFF0F3',
    },
    dark: {
      background: '#1A1118',
      surface: '#2D1B2E',
      surfaceMuted: '#3D2438',
      text: '#FCE4EC',
      textMuted: '#D8A7B9',
      border: '#5A3448',
      track: '#3D2438',
    },
  },
  typography: {
    fontFamily: {
      heading:
        '"Inter", -apple-system, blinkmacsystemfont, "Segoe UI", roboto, "Helvetica Neue", arial, sans-serif',
      body:
        '"Inter", -apple-system, blinkmacsystemfont, "Segoe UI", roboto, "Helvetica Neue", arial, sans-serif',
      mono:
        '"SFMono-Regular", ui-monospace, "JetBrains Mono", "Cascadia Code", "Fira Code", monospace',
    },
    fontSize: {
      'xs': '0.75rem',
      'sm': '0.8125rem',
      'md': '0.9375rem',
      'lg': '1.125rem',
      'xl': '1.5rem',
      '2xl': '1.75rem',
      '3xl': '2.375rem',
      '4xl': '2.875rem',
    },
    lineHeight: {
      tight: '1.15',
      snug: '1.35',
      normal: '1.5',
      relaxed: '1.75',
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  spacing: {
    'xs': '4px',
    'sm': '8px',
    'md': '12px',
    'lg': '16px',
    'xl': '24px',
    '2xl': '32px',
    '3xl': '40px',
    '4xl': '48px',
  },
  radius: {
    xs: '6px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    pill: '999px',
  },
  shadow: {
    xs: '0 1px 2px rgba(45, 27, 46, 0.06)',
    sm: '0 4px 12px rgba(45, 27, 46, 0.08)',
    md: '0 12px 24px rgba(45, 27, 46, 0.10)',
    lg: '0 18px 36px rgba(45, 27, 46, 0.12)',
  },
} as const

export type DesignTokens = typeof tokens
