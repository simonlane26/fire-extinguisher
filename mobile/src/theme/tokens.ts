/**
 * FireXCheck Design Tokens
 * Matches the web dashboard design system (Inter + JetBrains Mono, #DC4A2D accent)
 */

export const colors = {
  // Core
  accent: '#DC4A2D',
  accentLight: '#FEF2F0',

  // Neutrals (light)
  bg: '#F5F5F4',
  surface: '#FFFFFF',
  fg: '#1C1917',
  fgSecondary: '#78716C',
  fgTertiary: '#A8A29E',
  border: '#E7E5E4',
  borderLight: '#F0EEEC',

  // Status
  green: '#16A34A',
  greenBg: '#F0FDF4',
  amber: '#D97706',
  amberBg: '#FFFBEB',
  red: '#DC2626',
  redBg: '#FEF2F2',
  blue: '#2563EB',
  blueBg: '#EFF6FF',
  purple: '#7C3AED',
  purpleBg: '#F5F3FF',
} as const;

export const colorsDark = {
  accent: '#EF6A4C',
  accentLight: '#2C1610',

  bg: '#0C0A09',
  surface: '#1C1917',
  fg: '#FAFAF9',
  fgSecondary: '#A8A29E',
  fgTertiary: '#57534E',
  border: '#292524',
  borderLight: '#1C1917',

  green: '#22C55E',
  greenBg: '#052E16',
  amber: '#F59E0B',
  amberBg: '#2C1A00',
  red: '#EF4444',
  redBg: '#2C0B0B',
  blue: '#3B82F6',
  blueBg: '#0C1A2E',
  purple: '#8B5CF6',
  purpleBg: '#1A0E2E',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
} as const;

export const radius = {
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  full: 9999,
} as const;

export const fontSize = {
  xs: 10,
  sm: 11,
  base: 13,
  md: 14,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
} as const;

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};
