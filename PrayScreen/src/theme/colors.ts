/**
 * Color palette based on design(1).json
 * Dark theme with warm coral accents
 */

export const colors = {
  // Background colors
  background: '#0E1217',
  surface: '#15191F',
  surfaceElevated: '#1D232B',
  surfaceMuted: '#232A33',
  outline: '#2B323C',

  // Text colors
  textPrimary: '#E8ECF2',
  textSecondary: '#B8C0CC',
  textMuted: '#8C97A6',

  // Accent colors
  accent: '#FF6A5A',
  accentSoft: '#FF8A70',

  // Status colors
  success: '#34C759',
  warning: '#FFC773',
  danger: '#FF3B30',
  starGold: '#F7C948',

  // Disabled states
  disabledBg: 'rgba(255,255,255,0.06)',
  disabledText: 'rgba(232,236,242,0.38)',

  // Transparent colors
  transparent: 'transparent',
  black: '#000000',
  white: '#FFFFFF',
} as const;

export const gradients = {
  bgRadialWarm: {
    colors: ['rgba(255,106,90,0.22)', 'rgba(255,106,90,0.12)', 'rgba(14,18,23,0.0)'],
    locations: [0, 0.3, 0.7],
  },
  headlineSilver: {
    colors: ['#E6EBF2', '#C7CED8', '#AAB3BF'],
    locations: [0, 0.6, 1],
  },
  buttonShine: {
    colors: ['rgba(255,255,255,0.10)', 'rgba(255,255,255,0.0)'],
    locations: [0, 1],
  },
} as const;

export type Colors = typeof colors;
export type ColorKey = keyof Colors;
