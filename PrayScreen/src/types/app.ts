/**
 * App blocking and management type definitions
 * Based on DATA_STRUCTURES.md
 */

export interface BlockedApp {
  id: string;
  userId: string;

  // App identification
  bundleId: string; // iOS: com.facebook.Facebook, Android: com.facebook.katana
  appName: string;
  appIcon?: string; // Base64 or URL

  // Blocking state
  isBlocked: boolean;
  blockedAt?: Date;

  // Unlock state
  isUnlocked: boolean;
  unlockedAt?: Date;
  unlockExpiresAt?: Date;

  // Statistics
  blockAttempts: number;
  successfulUnlocks: number;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface InstalledApp {
  bundleId: string;
  appName: string;
  appIcon?: string;
}
