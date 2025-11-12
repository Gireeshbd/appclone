/**
 * Motion/Animation system based on design(1).json
 * Provides consistent animation timings and easings
 */

export const motion = {
  durations: {
    fast: 120,
    normal: 220,
    slow: 360,
  },
  easings: {
    standard: [0.2, 0.8, 0.2, 1] as const,
    emphasized: [0.05, 0.7, 0.1, 1] as const,
  },
  tapScale: 0.98,
} as const;

export type Motion = typeof motion;
