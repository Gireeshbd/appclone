/**
 * Prayer session type definitions
 * Based on DATA_STRUCTURES.md
 */

export type BypassReason = 'emergency' | 'skip' | 'force_quit' | 'app_killed';

export interface PrayerSession {
  id: string;
  userId: string;

  // What was read
  verseId: string;
  verseText: string; // Snapshot
  verseReference?: string; // Snapshot

  // When and how long
  startedAt: Date;
  completedAt: Date;
  duration: number; // Actual seconds
  requiredDuration: number; // Minimum required

  // Context
  triggeredBy: string[]; // App bundle IDs
  wasCompleted: boolean;
  bypassReason?: BypassReason;

  // Actions taken
  appsUnlocked: string[]; // App bundle IDs
  unlockDuration: number; // Seconds

  // Metadata
  deviceType: 'ios' | 'android';
  appVersion: string;
  createdAt: Date;
}
