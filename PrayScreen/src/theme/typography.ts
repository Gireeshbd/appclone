/**
 * Typography system based on design(1).json
 * Uses serif fonts for display/headlines and sans-serif for body text
 */

import {Platform, TextStyle} from 'react-native';

// Font families
export const fonts = {
  display: Platform.select({
    ios: 'Georgia',
    android: 'serif',
    default: 'Georgia',
  }),
  body: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
} as const;

// Typography variants
export const typography = {
  display1: {
    fontFamily: fonts.display,
    fontSize: 44,
    lineHeight: 52,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -0.5,
  },
  display2: {
    fontFamily: fonts.display,
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -0.4,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -0.3,
  },
  headline: {
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -0.25,
  },
  bodyLg: {
    fontFamily: fonts.body,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
  bodySm: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
  button: {
    fontFamily: fonts.body,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
  caption: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as TextStyle['fontWeight'],
    letterSpacing: 0.2,
  },
} as const;

export type Typography = typeof typography;
export type TypographyKey = keyof Typography;
