/**
 * Main theme export
 * Combines all design tokens from design(1).json
 */

import {colors, gradients} from './colors';
import {fonts, typography} from './typography';
import {spacing, radii, shadows} from './spacing';
import {motion} from './motion';

export const theme = {
  colors,
  gradients,
  fonts,
  typography,
  spacing,
  radii,
  shadows,
  motion,
} as const;

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './motion';

export type Theme = typeof theme;
export default theme;
