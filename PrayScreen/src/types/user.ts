/**
 * User-related type definitions
 * Based on DATA_STRUCTURES.md
 */

export type SubscriptionStatus = 'free' | 'active' | 'trial' | 'expired' | 'cancelled';

export type SubscriptionTier = 'free' | 'premium';

export type Theme = 'light' | 'dark' | 'system';

export type FontSize = 'small' | 'medium' | 'large';

export type BibleTranslation = 'ESV' | 'NIV' | 'KJV' | 'NKJV';

export interface TimeRange {
  start: string; // HH:MM format
  end: string; // HH:MM format
}

export interface BlockingSchedule {
  enabled: boolean;
  mode: 'always' | 'schedule';
  schedule?: {
    monday: TimeRange[];
    tuesday: TimeRange[];
    wednesday: TimeRange[];
    thursday: TimeRange[];
    friday: TimeRange[];
    saturday: TimeRange[];
    sunday: TimeRange[];
  };
}

export interface UserPreferences {
  // Blocking settings
  minReadingDuration: number; // Seconds (30-120)
  unlockDuration: number; // Seconds (300-86400)

  // Schedule
  blockingSchedule: BlockingSchedule;

  // Notifications
  enableNotifications: boolean;
  dailyVerseTime?: string; // HH:MM format
  prayerReminderTimes: string[]; // Array of HH:MM times

  // UI preferences
  theme: Theme;
  fontSize: FontSize;

  // Content preferences
  verseCategories: string[];
  bibleTranslation: BibleTranslation;

  // Advanced (Premium)
  enableEmergencyBypass: boolean;
  bypassCooldown: number; // Minutes
}

export interface Achievement {
  id: string;
  unlockedAt: Date;
  type: 'streak' | 'sessions' | 'time' | 'special';
}

export interface UserStats {
  totalPrayerSessions: number;
  totalReadingTime: number; // Total seconds
  currentStreak: number; // Days
  longestStreak: number; // Days
  lastPrayerDate: Date;
  totalUnlocks: number;
  totalBypassesUsed: number;
  achievements: Achievement[];
}

export interface User {
  id: string; // UUID
  email?: string;
  createdAt: Date;
  lastActiveAt: Date;

  // Subscription info
  subscriptionStatus: SubscriptionStatus;
  subscriptionTier: SubscriptionTier;
  subscriptionExpiresAt?: Date;
  revenueCatUserId: string;

  // Preferences and stats
  preferences: UserPreferences;
  stats: UserStats;
}
