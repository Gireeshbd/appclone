/**
 * Spacing system based on design(1).json
 * Provides consistent spacing throughout the app
 */

export const spacing = {
  scale: [0, 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64] as const,

  // Named spacing for common use cases
  screenPadding: 24,
  gutter: 12,
  rowSpacing: 16,
  sectionY: 40,
  cardPadding: 20,
  buttonPaddingX: 24,
  buttonPaddingY: 18,
  chipPadding: 16,
  sheetHandle: 6,
} as const;

// Border radius values
export const radii = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 28,
  pill: 999,
} as const;

// Elevation/Shadow styles
export const shadows = {
  shadow1: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  shadow2: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
  },
  shadow3: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 16},
    shadowOpacity: 0.45,
    shadowRadius: 48,
    elevation: 16,
  },
  innerGlow: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
} as const;

export type Spacing = typeof spacing;
export type Radii = typeof radii;
export type Shadows = typeof shadows;
