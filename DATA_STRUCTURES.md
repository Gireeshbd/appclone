# Prayer-Based App Blocker - Data Structures & Schema

## Overview
This document defines all data structures, database schemas, and API models for the application.

---

## 1. User Profile

### Purpose
Stores user account information, preferences, and subscription status.

### Structure

```typescript
interface User {
  id: string;                          // Unique user identifier (UUID)
  email?: string;                      // Optional email for cloud sync
  createdAt: Date;                     // Account creation timestamp
  lastActiveAt: Date;                  // Last activity timestamp
  
  // Subscription info (synced with RevenueCat)
  subscriptionStatus: SubscriptionStatus;
  subscriptionTier: 'free' | 'premium';
  subscriptionExpiresAt?: Date;        // For premium users
  revenueCatUserId: string;            // RevenueCat customer ID
  
  // App preferences
  preferences: UserPreferences;
  
  // Statistics
  stats: UserStats;
}

type SubscriptionStatus = 
  | 'free'           // No subscription
  | 'active'         // Active premium subscription
  | 'trial'          // Trial period
  | 'expired'        // Subscription expired
  | 'cancelled';     // Subscription cancelled but still valid

interface UserPreferences {
  // Blocking settings
  minReadingDuration: number;          // Seconds (30-120), default: 30
  unlockDuration: number;              // Seconds (300-86400), default: 900 (15min)
  
  // Schedule
  blockingSchedule: BlockingSchedule;
  
  // Notifications
  enableNotifications: boolean;
  dailyVerseTime?: string;             // HH:MM format, e.g., "08:00"
  prayerReminderTimes: string[];       // Array of HH:MM times
  
  // UI preferences
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  
  // Content preferences
  verseCategories: string[];           // Preferred categories
  bibleTranslation: 'ESV' | 'NIV' | 'KJV' | 'NKJV';
  
  // Advanced (Premium)
  enableEmergencyBypass: boolean;
  bypassCooldown: number;              // Minutes before bypass available again
}

interface BlockingSchedule {
  enabled: boolean;
  mode: 'always' | 'schedule';
  
  // Only used when mode = 'schedule'
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

interface TimeRange {
  start: string;                       // HH:MM format
  end: string;                         // HH:MM format
}

interface UserStats {
  totalPrayerSessions: number;
  totalReadingTime: number;            // Total seconds spent reading
  currentStreak: number;               // Days
  longestStreak: number;               // Days
  lastPrayerDate: Date;
  totalUnlocks: number;
  totalBypassesUsed: number;
  
  // Achievements
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  unlockedAt: Date;
  type: 'streak' | 'sessions' | 'time' | 'special';
}
```

---

## 2. Blocked Apps

### Purpose
Tracks which apps are blocked and their current state.

### Structure

```typescript
interface BlockedApp {
  id: string;                          // Unique ID
  userId: string;                      // Owner user ID
  
  // App identification
  bundleId: string;                    // iOS: com.facebook.Facebook, Android: com.facebook.katana
  appName: string;                     // Display name
  appIcon?: string;                    // Base64 or URL to icon
  
  // Blocking state
  isBlocked: boolean;                  // Currently blocked?
  blockedAt?: Date;                    // When blocking started
  
  // Unlock state
  isUnlocked: boolean;                 // Currently unlocked?
  unlockedAt?: Date;                   // When unlocked
  unlockExpiresAt?: Date;              // When unlock expires
  
  // Statistics
  blockAttempts: number;               // How many times user tried to open
  successfulUnlocks: number;           // How many times successfully unlocked
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 3. Bible Verses / Prayer Content

### Purpose
Stores the content that users read during unlock sessions.

### Structure

```typescript
interface VerseContent {
  id: string;                          // Unique verse ID
  type: 'verse' | 'prayer' | 'custom';
  
  // Content
  text: string;                        // The actual verse/prayer text
  reference?: string;                  // e.g., "John 3:16", null for prayers
  translation?: string;                // e.g., "ESV", "NIV"
  
  // Categorization
  categories: string[];                // ['strength', 'peace', 'temptation']
  tags: string[];                      // Additional searchable tags
  
  // Display
  title?: string;                      // Optional title for prayers
  author?: string;                     // For prayers/custom content
  
  // Access control
  isPremium: boolean;                  // Premium content?
  
  // Metadata
  length: number;                      // Character count
  readingTimeEstimate: number;         // Estimated reading time in seconds
  
  // Statistics
  timesShown: number;                  // How many times shown to users
  averageReadingTime: number;          // Actual average reading time
  
  createdAt: Date;
  updatedAt: Date;
}

// Predefined categories
type VerseCategory = 
  | 'strength'
  | 'peace'
  | 'gratitude'
  | 'wisdom'
  | 'love'
  | 'faith'
  | 'hope'
  | 'forgiveness'
  | 'temptation'
  | 'courage'
  | 'patience'
  | 'joy'
  | 'guidance'
  | 'protection'
  | 'comfort';
```

---

## 4. Prayer Sessions (Reading History)

### Purpose
Records each time a user completes a prayer/reading session.

### Structure

```typescript
interface PrayerSession {
  id: string;                          // Unique session ID
  userId: string;                      // User who completed it
  
  // What was read
  verseId: string;                     // Reference to VerseContent
  verseText: string;                   // Snapshot of text (in case verse is updated)
  verseReference?: string;             // Snapshot of reference
  
  // When and how long
  startedAt: Date;                     // When user started reading
  completedAt: Date;                   // When user finished
  duration: number;                    // Actual seconds spent reading
  requiredDuration: number;            // Minimum required seconds
  
  // Context
  triggeredBy: string[];               // Array of app bundle IDs that were blocked
  wasCompleted: boolean;               // Did user complete or bypass?
  bypassReason?: BypassReason;         // If bypassed, why?
  
  // Actions taken after
  appsUnlocked: string[];              // Array of app bundle IDs unlocked
  unlockDuration: number;              // How long apps were unlocked for
  
  // Metadata
  deviceType: 'ios' | 'android';
  appVersion: string;
  createdAt: Date;
}

type BypassReason = 
  | 'emergency'                        // Used emergency bypass
  | 'skip'                            // User skipped (if allowed)
  | 'force_quit'                      // User force quit the app
  | 'app_killed';                     // System killed the app
```

---

## 5. Daily Content

### Purpose
Manages the "Daily Verse" feature.

### Structure

```typescript
interface DailyContent {
  id: string;
  date: string;                        // YYYY-MM-DD format
  
  // Content
  verseId: string;                     // Reference to VerseContent
  
  // Display
  imageUrl?: string;                   // Optional background image
  theme?: string;                      // Color theme for the day
  
  // Statistics
  viewCount: number;                   // How many users viewed
  shareCount: number;                  // How many times shared
  favoriteCount: number;               // How many favorited
  
  createdAt: Date;
}
```

---

## 6. User Verse Interactions

### Purpose
Tracks user interactions with verses (favorites, notes, etc.).

### Structure

```typescript
interface UserVerseInteraction {
  id: string;
  userId: string;
  verseId: string;
  
  // Interactions
  isFavorite: boolean;
  favoritedAt?: Date;
  
  notes?: string;                      // User's personal notes (Premium)
  notesUpdatedAt?: Date;
  
  // Statistics
  timesRead: number;
  lastReadAt: Date;
  totalReadingTime: number;            // Total seconds spent on this verse
  
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 7. Notifications

### Purpose
Manages scheduled and triggered notifications.

### Structure

```typescript
interface NotificationSchedule {
  id: string;
  userId: string;
  
  type: NotificationType;
  
  // Scheduling
  enabled: boolean;
  schedule: {
    time?: string;                     // HH:MM for daily notifications
    daysOfWeek?: number[];            // 0-6 for weekly (0=Sunday)
    frequency?: 'daily' | 'weekly' | 'custom';
  };
  
  // Content
  title: string;
  body: string;
  
  // Delivery tracking
  lastSentAt?: Date;
  nextScheduledAt?: Date;
  deliveryCount: number;
  
  createdAt: Date;
  updatedAt: Date;
}

type NotificationType = 
  | 'daily_verse'                      // Morning daily verse
  | 'prayer_reminder'                  // Reminder to pray
  | 'streak_reminder'                  // Don't break your streak!
  | 'achievement'                      // Earned an achievement
  | 'weekly_summary';                  // Weekly progress report
```

---

## 8. RevenueCat Integration

### Purpose
Manages subscription state and entitlements.

### Structure

```typescript
interface SubscriptionInfo {
  userId: string;
  revenueCatUserId: string;
  
  // Current entitlements (synced from RevenueCat)
  entitlements: {
    premium: EntitlementInfo;
  };
  
  // Active subscriptions
  activeSubscriptions: ActiveSubscription[];
  
  // Purchase history
  purchases: Purchase[];
  
  // Cache
  lastSyncedAt: Date;
}

interface EntitlementInfo {
  isActive: boolean;
  willRenew: boolean;
  periodType: 'trial' | 'monthly' | 'annual';
  expirationDate?: Date;
  unsubscribeDetectedAt?: Date;
  billingIssueDetectedAt?: Date;
}

interface ActiveSubscription {
  productId: string;                   // e.g., "premium_monthly"
  purchaseDate: Date;
  expirationDate?: Date;
  isInTrialPeriod: boolean;
  store: 'app_store' | 'play_store';
  isSandbox: boolean;                  // For testing
}

interface Purchase {
  productId: string;
  purchaseDate: Date;
  revenueCatId: string;
  price: number;
  currency: string;
  store: 'app_store' | 'play_store';
}
```

---

## 9. App Analytics Events

### Purpose
Track important user actions for analytics.

### Structure

```typescript
interface AnalyticsEvent {
  id: string;
  userId: string;
  
  // Event details
  eventName: string;
  eventType: EventType;
  
  // Context
  timestamp: Date;
  sessionId: string;                   // Group events by session
  
  // Event data
  properties: Record<string, any>;
  
  // Device info
  platform: 'ios' | 'android';
  appVersion: string;
  osVersion: string;
  deviceModel?: string;
}

type EventType = 
  | 'user_action'                      // User clicked/tapped something
  | 'screen_view'                      // User viewed a screen
  | 'system_event'                     // App state change
  | 'prayer_event'                     // Prayer/reading related
  | 'subscription_event'               // Subscription changes
  | 'error';                           // Error occurred

// Example events:
// - "app_opened"
// - "prayer_session_started"
// - "prayer_session_completed"
// - "apps_unlocked"
// - "app_blocked_attempt"
// - "paywall_viewed"
// - "subscription_started"
// - "daily_verse_viewed"
// - "verse_favorited"
// - "achievement_unlocked"
// - "emergency_bypass_used"
```

---

## 10. App State (Local Storage)

### Purpose
Manages temporary app state that doesn't need to persist long-term.

### Structure

```typescript
interface AppState {
  // Current blocking state
  isBlocking: boolean;
  currentlyUnlockedApps: string[];     // Bundle IDs
  unlockExpiresAt?: Date;
  
  // Current session
  activePrayerSession?: {
    sessionId: string;
    verseId: string;
    startedAt: Date;
    requiredDuration: number;
    triggeredByApps: string[];
  };
  
  // Cache
  cachedVerses: VerseContent[];        // Recently shown verses
  cachedDailyVerse?: DailyContent;
  
  // UI state
  hasCompletedOnboarding: boolean;
  lastShownPaywall?: Date;
  paywallDismissCount: number;
  
  // Feature flags (can be controlled remotely)
  features: {
    enableNewUI: boolean;
    enableCustomPrayers: boolean;
    enableSocialSharing: boolean;
    [key: string]: boolean;
  };
}
```

---

## API Endpoints (Backend)

If you build a backend, here are suggested endpoints:

### Authentication
- `POST /auth/register` - Create new account
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh token
- `POST /auth/logout` - Logout

### User
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update profile
- `GET /user/stats` - Get user statistics
- `DELETE /user/account` - Delete account

### Content
- `GET /verses` - List verses (with pagination, filtering)
- `GET /verses/:id` - Get specific verse
- `GET /verses/daily` - Get today's daily verse
- `GET /verses/random` - Get random verse (based on preferences)
- `POST /verses/custom` - Create custom verse (Premium)

### Prayer Sessions
- `POST /sessions` - Record new session
- `GET /sessions` - Get user's session history
- `GET /sessions/stats` - Get session statistics

### Blocked Apps
- `GET /blocked-apps` - Get user's blocked apps
- `POST /blocked-apps` - Add app to block list
- `DELETE /blocked-apps/:id` - Remove from block list
- `PUT /blocked-apps/:id/unlock` - Unlock specific app

### Interactions
- `POST /verses/:id/favorite` - Favorite a verse
- `DELETE /verses/:id/favorite` - Unfavorite
- `PUT /verses/:id/notes` - Add/update notes (Premium)

### Notifications
- `GET /notifications` - Get user's notifications
- `PUT /notifications/:id` - Update notification settings

### Subscription (RevenueCat Webhooks)
- `POST /webhooks/revenuecat` - Receive subscription events from RevenueCat

### Analytics
- `POST /analytics/events` - Batch send analytics events

---

## Data Relationships

```
User (1) ─── (many) BlockedApps
User (1) ─── (many) PrayerSessions
User (1) ─── (many) UserVerseInteractions
User (1) ─── (many) NotificationSchedules
User (1) ─── (1) SubscriptionInfo
User (1) ─── (many) AnalyticsEvents

VerseContent (1) ─── (many) PrayerSessions
VerseContent (1) ─── (many) UserVerseInteractions
VerseContent (1) ─── (many) DailyContent

DailyContent (1) ─── (1) VerseContent
```

---

## Storage Strategy

### Local Storage (On Device)
- User preferences
- Blocked apps list
- Recently read verses (cache)
- Current unlock state
- Temporary session data

**Technology**: 
- iOS: UserDefaults, Core Data, or Realm
- Android: SharedPreferences, Room Database, or Realm

### Cloud Storage (Backend/Firebase)
- User account data
- Prayer session history
- Verse interactions
- Subscription status (synced from RevenueCat)
- Cross-device sync data

**Technology**: 
- Firebase Firestore
- PostgreSQL + REST API
- Supabase
- AWS Amplify

### RevenueCat
- Subscription status
- Purchase history
- Entitlements
- Customer info

---

## Data Privacy Considerations

1. **Minimal Data Collection**: Only collect what's necessary
2. **No App Usage Tracking**: Don't track what users do in blocked apps
3. **Anonymous Analytics**: Anonymize all analytics data
4. **Local-First**: Store sensitive data locally when possible
5. **Encryption**: Encrypt sensitive data (notes, custom prayers)
6. **Right to Delete**: Support account deletion with full data removal
7. **GDPR Compliance**: If serving European users
8. **COPPA Compliance**: If allowing users under 13

---

## Next Steps

1. Review these data structures and provide feedback
2. Choose your tech stack (React Native, Flutter, Native, etc.)
3. Choose backend solution (Firebase, Supabase, custom API)
4. Set up RevenueCat account and configure products
5. Create database migrations or Firestore rules
6. Implement data access layer
7. Build API client for mobile app
