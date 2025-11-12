# JSON Data Examples

This document contains realistic JSON examples for all data structures used in the Prayer-Based App Blocker.

---

## 1. User Profile Example

```json
{
  "id": "usr_9k2j4h8g6f4d2s1a",
  "email": "john.doe@example.com",
  "createdAt": "2024-01-15T08:30:00Z",
  "lastActiveAt": "2024-02-20T14:23:15Z",
  
  "subscriptionStatus": "active",
  "subscriptionTier": "premium",
  "subscriptionExpiresAt": "2024-12-15T08:30:00Z",
  "revenueCatUserId": "rc_9k2j4h8g6f4d2s1a",
  
  "preferences": {
    "minReadingDuration": 45,
    "unlockDuration": 1800,
    
    "blockingSchedule": {
      "enabled": true,
      "mode": "schedule",
      "schedule": {
        "monday": [
          {"start": "09:00", "end": "17:00"},
          {"start": "19:00", "end": "22:00"}
        ],
        "tuesday": [
          {"start": "09:00", "end": "17:00"}
        ],
        "wednesday": [
          {"start": "09:00", "end": "17:00"}
        ],
        "thursday": [
          {"start": "09:00", "end": "17:00"}
        ],
        "friday": [
          {"start": "09:00", "end": "17:00"}
        ],
        "saturday": [
          {"start": "10:00", "end": "15:00"}
        ],
        "sunday": [
          {"start": "19:00", "end": "21:00"}
        ]
      }
    },
    
    "enableNotifications": true,
    "dailyVerseTime": "07:00",
    "prayerReminderTimes": ["07:00", "12:00", "20:00"],
    
    "theme": "dark",
    "fontSize": "medium",
    
    "verseCategories": ["strength", "peace", "wisdom", "guidance"],
    "bibleTranslation": "ESV",
    
    "enableEmergencyBypass": false,
    "bypassCooldown": 60
  },
  
  "stats": {
    "totalPrayerSessions": 127,
    "totalReadingTime": 6840,
    "currentStreak": 23,
    "longestStreak": 45,
    "lastPrayerDate": "2024-02-20T14:23:15Z",
    "totalUnlocks": 127,
    "totalBypassesUsed": 3,
    
    "achievements": [
      {
        "id": "ach_first_prayer",
        "unlockedAt": "2024-01-15T09:15:00Z",
        "type": "special"
      },
      {
        "id": "ach_7_day_streak",
        "unlockedAt": "2024-01-22T08:00:00Z",
        "type": "streak"
      },
      {
        "id": "ach_30_day_streak",
        "unlockedAt": "2024-02-14T08:00:00Z",
        "type": "streak"
      },
      {
        "id": "ach_100_sessions",
        "unlockedAt": "2024-02-18T16:30:00Z",
        "type": "sessions"
      }
    ]
  }
}
```

---

## 2. Blocked Apps Example

```json
[
  {
    "id": "ba_1a2b3c4d5e6f7g8h",
    "userId": "usr_9k2j4h8g6f4d2s1a",
    
    "bundleId": "com.facebook.Facebook",
    "appName": "Facebook",
    "appIcon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...",
    
    "isBlocked": true,
    "blockedAt": "2024-02-20T09:00:00Z",
    
    "isUnlocked": false,
    "unlockedAt": null,
    "unlockExpiresAt": null,
    
    "blockAttempts": 47,
    "successfulUnlocks": 42,
    
    "createdAt": "2024-01-15T08:45:00Z",
    "updatedAt": "2024-02-20T14:20:00Z"
  },
  {
    "id": "ba_2b3c4d5e6f7g8h9i",
    "userId": "usr_9k2j4h8g6f4d2s1a",
    
    "bundleId": "com.instagram.Instagram",
    "appName": "Instagram",
    "appIcon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...",
    
    "isBlocked": true,
    "blockedAt": "2024-02-20T09:00:00Z",
    
    "isUnlocked": true,
    "unlockedAt": "2024-02-20T14:15:00Z",
    "unlockExpiresAt": "2024-02-20T14:45:00Z",
    
    "blockAttempts": 89,
    "successfulUnlocks": 85,
    
    "createdAt": "2024-01-15T08:45:00Z",
    "updatedAt": "2024-02-20T14:15:00Z"
  },
  {
    "id": "ba_3c4d5e6f7g8h9i0j",
    "userId": "usr_9k2j4h8g6f4d2s1a",
    
    "bundleId": "com.twitter.twitter",
    "appName": "X (Twitter)",
    "appIcon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...",
    
    "isBlocked": true,
    "blockedAt": "2024-02-20T09:00:00Z",
    
    "isUnlocked": false,
    "unlockedAt": null,
    "unlockExpiresAt": null,
    
    "blockAttempts": 156,
    "successfulUnlocks": 149,
    
    "createdAt": "2024-01-16T10:20:00Z",
    "updatedAt": "2024-02-20T13:55:00Z"
  }
]
```

---

## 3. Verse Content Examples

```json
[
  {
    "id": "verse_001",
    "type": "verse",
    
    "text": "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
    "reference": "John 3:16",
    "translation": "ESV",
    
    "categories": ["love", "faith", "hope", "salvation"],
    "tags": ["popular", "evangelism", "gospel", "beginner-friendly"],
    
    "title": null,
    "author": null,
    
    "isPremium": false,
    
    "length": 124,
    "readingTimeEstimate": 35,
    
    "timesShown": 15234,
    "averageReadingTime": 42.3,
    
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-02-15T10:30:00Z"
  },
  {
    "id": "verse_042",
    "type": "verse",
    
    "text": "I can do all things through him who strengthens me.",
    "reference": "Philippians 4:13",
    "translation": "ESV",
    
    "categories": ["strength", "courage", "faith", "perseverance"],
    "tags": ["popular", "encouragement", "motivation"],
    
    "title": null,
    "author": null,
    
    "isPremium": false,
    
    "length": 52,
    "readingTimeEstimate": 25,
    
    "timesShown": 23456,
    "averageReadingTime": 38.7,
    
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-02-18T14:22:00Z"
  },
  {
    "id": "prayer_005",
    "type": "prayer",
    
    "text": "Lord, grant me the serenity to accept the things I cannot change, the courage to change the things I can, and the wisdom to know the difference. Living one day at a time, enjoying one moment at a time; accepting hardship as a pathway to peace.",
    "reference": null,
    "translation": null,
    
    "categories": ["peace", "wisdom", "acceptance", "courage"],
    "tags": ["serenity-prayer", "classic", "addiction-recovery"],
    
    "title": "Serenity Prayer",
    "author": "Reinhold Niebuhr (adapted)",
    
    "isPremium": false,
    
    "length": 245,
    "readingTimeEstimate": 55,
    
    "timesShown": 8934,
    "averageReadingTime": 61.2,
    
    "createdAt": "2024-01-05T00:00:00Z",
    "updatedAt": "2024-02-10T09:15:00Z"
  },
  {
    "id": "custom_user_001",
    "type": "custom",
    
    "text": "Dear Heavenly Father, help me to be present with my family today. Remove the distractions and help me focus on what truly matters. Give me patience, love, and understanding. In Jesus' name, Amen.",
    "reference": null,
    "translation": null,
    
    "categories": ["family", "focus", "presence"],
    "tags": ["personal", "custom"],
    
    "title": "Prayer for Family Time",
    "author": "John Doe",
    
    "isPremium": true,
    
    "length": 189,
    "readingTimeEstimate": 45,
    
    "timesShown": 12,
    "averageReadingTime": 52.8,
    
    "createdAt": "2024-02-01T15:30:00Z",
    "updatedAt": "2024-02-01T15:30:00Z"
  }
]
```

---

## 4. Prayer Session Examples

```json
[
  {
    "id": "session_a1b2c3d4e5f6",
    "userId": "usr_9k2j4h8g6f4d2s1a",
    
    "verseId": "verse_042",
    "verseText": "I can do all things through him who strengthens me.",
    "verseReference": "Philippians 4:13",
    
    "startedAt": "2024-02-20T14:12:45Z",
    "completedAt": "2024-02-20T14:13:32Z",
    "duration": 47,
    "requiredDuration": 45,
    
    "triggeredBy": ["com.instagram.Instagram", "com.facebook.Facebook"],
    "wasCompleted": true,
    "bypassReason": null,
    
    "appsUnlocked": ["com.instagram.Instagram", "com.facebook.Facebook"],
    "unlockDuration": 1800,
    
    "deviceType": "ios",
    "appVersion": "1.2.3",
    "createdAt": "2024-02-20T14:13:32Z"
  },
  {
    "id": "session_b2c3d4e5f6g7",
    "userId": "usr_9k2j4h8g6f4d2s1a",
    
    "verseId": "verse_001",
    "verseText": "For God so loved the world, that he gave his only Son...",
    "verseReference": "John 3:16",
    
    "startedAt": "2024-02-20T10:15:22Z",
    "completedAt": "2024-02-20T10:16:18Z",
    "duration": 56,
    "requiredDuration": 45,
    
    "triggeredBy": ["com.twitter.twitter"],
    "wasCompleted": true,
    "bypassReason": null,
    
    "appsUnlocked": ["com.twitter.twitter"],
    "unlockDuration": 1800,
    
    "deviceType": "ios",
    "appVersion": "1.2.3",
    "createdAt": "2024-02-20T10:16:18Z"
  },
  {
    "id": "session_c3d4e5f6g7h8",
    "userId": "usr_9k2j4h8g6f4d2s1a",
    
    "verseId": "prayer_005",
    "verseText": "Lord, grant me the serenity to accept the things I cannot change...",
    "verseReference": null,
    
    "startedAt": "2024-02-19T16:45:10Z",
    "completedAt": "2024-02-19T16:45:25Z",
    "duration": 15,
    "requiredDuration": 45,
    
    "triggeredBy": ["com.instagram.Instagram"],
    "wasCompleted": false,
    "bypassReason": "emergency",
    
    "appsUnlocked": ["com.instagram.Instagram"],
    "unlockDuration": 300,
    
    "deviceType": "ios",
    "appVersion": "1.2.3",
    "createdAt": "2024-02-19T16:45:25Z"
  }
]
```

---

## 5. Daily Content Example

```json
{
  "id": "daily_2024_02_20",
  "date": "2024-02-20",
  
  "verseId": "verse_042",
  
  "imageUrl": "https://cdn.example.com/daily-verse-backgrounds/2024-02-20.jpg",
  "theme": "sunrise-gradient",
  
  "viewCount": 8234,
  "shareCount": 142,
  "favoriteCount": 567,
  
  "createdAt": "2024-02-19T18:00:00Z"
}
```

---

## 6. User Verse Interaction Example

```json
{
  "id": "interaction_x1y2z3a4b5c6",
  "userId": "usr_9k2j4h8g6f4d2s1a",
  "verseId": "verse_042",
  
  "isFavorite": true,
  "favoritedAt": "2024-01-20T11:30:00Z",
  
  "notes": "This verse really helped me during my job interview. Remembering it gives me confidence.",
  "notesUpdatedAt": "2024-02-05T19:45:00Z",
  
  "timesRead": 8,
  "lastReadAt": "2024-02-20T14:12:45Z",
  "totalReadingTime": 384,
  
  "createdAt": "2024-01-20T11:30:00Z",
  "updatedAt": "2024-02-20T14:13:32Z"
}
```

---

## 7. Notification Schedule Examples

```json
[
  {
    "id": "notif_1a2b3c4d",
    "userId": "usr_9k2j4h8g6f4d2s1a",
    
    "type": "daily_verse",
    
    "enabled": true,
    "schedule": {
      "time": "07:00",
      "daysOfWeek": [1, 2, 3, 4, 5, 6, 0],
      "frequency": "daily"
    },
    
    "title": "Good Morning! ☀️",
    "body": "Start your day with today's verse",
    
    "lastSentAt": "2024-02-20T07:00:00Z",
    "nextScheduledAt": "2024-02-21T07:00:00Z",
    "deliveryCount": 36,
    
    "createdAt": "2024-01-15T08:30:00Z",
    "updatedAt": "2024-02-20T07:00:00Z"
  },
  {
    "id": "notif_2b3c4d5e",
    "userId": "usr_9k2j4h8g6f4d2s1a",
    
    "type": "prayer_reminder",
    
    "enabled": true,
    "schedule": {
      "time": "12:00",
      "daysOfWeek": [1, 2, 3, 4, 5],
      "frequency": "weekly"
    },
    
    "title": "Time to Pause 🙏",
    "body": "Take a moment to pray and reflect",
    
    "lastSentAt": "2024-02-20T12:00:00Z",
    "nextScheduledAt": "2024-02-21T12:00:00Z",
    "deliveryCount": 25,
    
    "createdAt": "2024-01-15T08:30:00Z",
    "updatedAt": "2024-02-20T12:00:00Z"
  },
  {
    "id": "notif_3c4d5e6f",
    "userId": "usr_9k2j4h8g6f4d2s1a",
    
    "type": "streak_reminder",
    
    "enabled": true,
    "schedule": {
      "time": "20:00",
      "daysOfWeek": [1, 2, 3, 4, 5, 6, 0],
      "frequency": "daily"
    },
    
    "title": "Don't Break Your Streak! 🔥",
    "body": "You're on a 23-day streak. Keep it going!",
    
    "lastSentAt": "2024-02-19T20:00:00Z",
    "nextScheduledAt": "2024-02-20T20:00:00Z",
    "deliveryCount": 23,
    
    "createdAt": "2024-01-28T18:00:00Z",
    "updatedAt": "2024-02-19T20:00:00Z"
  }
]
```

---

## 8. RevenueCat Subscription Info Example

```json
{
  "userId": "usr_9k2j4h8g6f4d2s1a",
  "revenueCatUserId": "rc_9k2j4h8g6f4d2s1a",
  
  "entitlements": {
    "premium": {
      "isActive": true,
      "willRenew": true,
      "periodType": "annual",
      "expirationDate": "2024-12-15T08:30:00Z",
      "unsubscribeDetectedAt": null,
      "billingIssueDetectedAt": null
    }
  },
  
  "activeSubscriptions": [
    {
      "productId": "premium_annual",
      "purchaseDate": "2024-01-15T08:30:00Z",
      "expirationDate": "2024-12-15T08:30:00Z",
      "isInTrialPeriod": false,
      "store": "app_store",
      "isSandbox": false
    }
  ],
  
  "purchases": [
    {
      "productId": "premium_annual",
      "purchaseDate": "2024-01-15T08:30:00Z",
      "revenueCatId": "rc_purchase_abc123xyz",
      "price": 29.99,
      "currency": "USD",
      "store": "app_store"
    }
  ],
  
  "lastSyncedAt": "2024-02-20T14:25:00Z"
}
```

### Free User Example

```json
{
  "userId": "usr_5f6g7h8i9j0k",
  "revenueCatUserId": "rc_5f6g7h8i9j0k",
  
  "entitlements": {
    "premium": {
      "isActive": false,
      "willRenew": false,
      "periodType": null,
      "expirationDate": null,
      "unsubscribeDetectedAt": null,
      "billingIssueDetectedAt": null
    }
  },
  
  "activeSubscriptions": [],
  
  "purchases": [],
  
  "lastSyncedAt": "2024-02-20T14:25:00Z"
}
```

### Trial User Example

```json
{
  "userId": "usr_6g7h8i9j0k1l",
  "revenueCatUserId": "rc_6g7h8i9j0k1l",
  
  "entitlements": {
    "premium": {
      "isActive": true,
      "willRenew": true,
      "periodType": "trial",
      "expirationDate": "2024-02-27T10:00:00Z",
      "unsubscribeDetectedAt": null,
      "billingIssueDetectedAt": null
    }
  },
  
  "activeSubscriptions": [
    {
      "productId": "premium_monthly",
      "purchaseDate": "2024-02-20T10:00:00Z",
      "expirationDate": "2024-02-27T10:00:00Z",
      "isInTrialPeriod": true,
      "store": "app_store",
      "isSandbox": false
    }
  ],
  
  "purchases": [],
  
  "lastSyncedAt": "2024-02-20T14:25:00Z"
}
```

---

## 9. Analytics Event Examples

```json
[
  {
    "id": "event_a1b2c3d4e5f6g7h8",
    "userId": "usr_9k2j4h8g6f4d2s1a",
    
    "eventName": "app_opened",
    "eventType": "system_event",
    
    "timestamp": "2024-02-20T14:10:00Z",
    "sessionId": "session_xyz789",
    
    "properties": {
      "is_first_launch": false,
      "days_since_install": 36,
      "launch_source": "notification"
    },
    
    "platform": "ios",
    "appVersion": "1.2.3",
    "osVersion": "17.3.1",
    "deviceModel": "iPhone 14 Pro"
  },
  {
    "id": "event_b2c3d4e5f6g7h8i9",
    "userId": "usr_9k2j4h8g6f4d2s1a",
    
    "eventName": "app_blocked_attempt",
    "eventType": "prayer_event",
    
    "timestamp": "2024-02-20T14:12:30Z",
    "sessionId": "session_xyz789",
    
    "properties": {
      "blocked_app": "com.instagram.Instagram",
      "blocked_app_name": "Instagram",
      "blocking_active_duration_seconds": 18780,
      "attempts_today": 3
    },
    
    "platform": "ios",
    "appVersion": "1.2.3",
    "osVersion": "17.3.1",
    "deviceModel": "iPhone 14 Pro"
  },
  {
    "id": "event_c3d4e5f6g7h8i9j0",
    "userId": "usr_9k2j4h8g6f4d2s1a",
    
    "eventName": "prayer_session_completed",
    "eventType": "prayer_event",
    
    "timestamp": "2024-02-20T14:13:32Z",
    "sessionId": "session_xyz789",
    
    "properties": {
      "verse_id": "verse_042",
      "verse_reference": "Philippians 4:13",
      "reading_duration_seconds": 47,
      "required_duration_seconds": 45,
      "completion_rate": 1.044,
      "triggered_by_apps": ["com.instagram.Instagram", "com.facebook.Facebook"],
      "apps_unlocked": ["com.instagram.Instagram", "com.facebook.Facebook"]
    },
    
    "platform": "ios",
    "appVersion": "1.2.3",
    "osVersion": "17.3.1",
    "deviceModel": "iPhone 14 Pro"
  },
  {
    "id": "event_d4e5f6g7h8i9j0k1",
    "userId": "usr_9k2j4h8g6f4d2s1a",
    
    "eventName": "paywall_viewed",
    "eventType": "subscription_event",
    
    "timestamp": "2024-02-20T14:20:00Z",
    "sessionId": "session_xyz789",
    
    "properties": {
      "placement": "blocked_apps_limit",
      "trigger": "attempted_to_add_4th_app",
      "current_tier": "free"
    },
    
    "platform": "ios",
    "appVersion": "1.2.3",
    "osVersion": "17.3.1",
    "deviceModel": "iPhone 14 Pro"
  },
  {
    "id": "event_e5f6g7h8i9j0k1l2",
    "userId": "usr_9k2j4h8g6f4d2s1a",
    
    "eventName": "achievement_unlocked",
    "eventType": "user_action",
    
    "timestamp": "2024-02-20T08:00:00Z",
    "sessionId": "session_abc123",
    
    "properties": {
      "achievement_id": "ach_30_day_streak",
      "achievement_type": "streak",
      "achievement_name": "Prayer Warrior - 30 Days"
    },
    
    "platform": "ios",
    "appVersion": "1.2.3",
    "osVersion": "17.3.1",
    "deviceModel": "iPhone 14 Pro"
  }
]
```

---

## 10. App State Example (Local Storage)

```json
{
  "isBlocking": true,
  "currentlyUnlockedApps": [
    "com.instagram.Instagram",
    "com.facebook.Facebook"
  ],
  "unlockExpiresAt": "2024-02-20T14:45:00Z",
  
  "activePrayerSession": null,
  
  "cachedVerses": [
    {
      "id": "verse_042",
      "type": "verse",
      "text": "I can do all things through him who strengthens me.",
      "reference": "Philippians 4:13",
      "translation": "ESV",
      "categories": ["strength", "courage", "faith"]
    },
    {
      "id": "verse_001",
      "type": "verse",
      "text": "For God so loved the world...",
      "reference": "John 3:16",
      "translation": "ESV",
      "categories": ["love", "faith", "hope"]
    }
  ],
  
  "cachedDailyVerse": {
    "id": "daily_2024_02_20",
    "date": "2024-02-20",
    "verseId": "verse_042",
    "imageUrl": "https://cdn.example.com/daily-verse-backgrounds/2024-02-20.jpg"
  },
  
  "hasCompletedOnboarding": true,
  "lastShownPaywall": "2024-02-15T10:30:00Z",
  "paywallDismissCount": 2,
  
  "features": {
    "enableNewUI": false,
    "enableCustomPrayers": true,
    "enableSocialSharing": true,
    "enableAchievements": true,
    "enableWeeklyReports": true
  }
}
```

---

## 11. API Request/Response Examples

### Get Random Verse (Based on User Preferences)

**Request:**
```http
GET /api/verses/random
Authorization: Bearer <token>
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "verse_042",
    "type": "verse",
    "text": "I can do all things through him who strengthens me.",
    "reference": "Philippians 4:13",
    "translation": "ESV",
    "categories": ["strength", "courage", "faith", "perseverance"],
    "tags": ["popular", "encouragement", "motivation"],
    "isPremium": false,
    "length": 52,
    "readingTimeEstimate": 25
  }
}
```

---

### Record Prayer Session

**Request:**
```http
POST /api/sessions
Authorization: Bearer <token>
Content-Type: application/json

{
  "verseId": "verse_042",
  "startedAt": "2024-02-20T14:12:45Z",
  "completedAt": "2024-02-20T14:13:32Z",
  "duration": 47,
  "requiredDuration": 45,
  "triggeredBy": ["com.instagram.Instagram", "com.facebook.Facebook"],
  "wasCompleted": true,
  "appsUnlocked": ["com.instagram.Instagram", "com.facebook.Facebook"],
  "unlockDuration": 1800
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "session_a1b2c3d4e5f6",
    "createdAt": "2024-02-20T14:13:32Z"
  },
  "stats": {
    "totalSessions": 128,
    "currentStreak": 23,
    "newAchievements": []
  }
}
```

---

### Check Subscription Status (RevenueCat)

**Request:**
```http
GET /api/subscription/status
Authorization: Bearer <token>
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tier": "premium",
    "status": "active",
    "willRenew": true,
    "expiresAt": "2024-12-15T08:30:00Z",
    "periodType": "annual",
    "entitlements": {
      "unlimitedApps": true,
      "fullVerseLibrary": true,
      "customPrayers": true,
      "advancedScheduling": true,
      "noAds": true,
      "analytics": true
    }
  }
}
```

---

### Update User Preferences

**Request:**
```http
PUT /api/user/preferences
Authorization: Bearer <token>
Content-Type: application/json

{
  "minReadingDuration": 60,
  "unlockDuration": 3600,
  "theme": "dark",
  "verseCategories": ["strength", "peace", "wisdom"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Preferences updated successfully",
  "data": {
    "minReadingDuration": 60,
    "unlockDuration": 3600,
    "theme": "dark",
    "verseCategories": ["strength", "peace", "wisdom"]
  }
}
```

---

## 12. RevenueCat Webhook Event Example

When a user makes a purchase or subscription changes, RevenueCat sends a webhook to your backend:

```json
{
  "event": {
    "type": "INITIAL_PURCHASE",
    "id": "unique_event_id_abc123",
    "app_id": "your_app_id",
    "app_user_id": "usr_9k2j4h8g6f4d2s1a",
    "aliases": ["rc_9k2j4h8g6f4d2s1a"],
    "original_app_user_id": "usr_9k2j4h8g6f4d2s1a",
    "product_id": "premium_annual",
    "entitlement_id": "premium",
    "entitlement_ids": ["premium"],
    "period_type": "NORMAL",
    "purchased_at_ms": 1705312200000,
    "expiration_at_ms": 1736848200000,
    "environment": "PRODUCTION",
    "presented_offering_id": "default",
    "transaction_id": "app_store_transaction_id_xyz",
    "original_transaction_id": "app_store_transaction_id_xyz",
    "is_trial_conversion": false,
    "price": 29.99,
    "currency": "USD",
    "store": "APP_STORE",
    "takehome_percentage": 0.85
  }
}
```

---

## Notes on JSON Data

### Date/Time Format
All timestamps use ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ` (UTC timezone)

### String vs Number
- IDs: Always strings
- Durations: Numbers (seconds)
- Prices: Numbers (float)
- Counts: Numbers (integer)

### Nullable Fields
Fields marked with `?` in TypeScript or that can be `null` will either:
- Be omitted from JSON (preferred)
- Be explicitly set to `null`

### Array vs Object
- Use arrays for lists/collections
- Use objects for key-value pairs with known keys

### Enums
Enum values are always strings in lowercase with underscores:
- Good: `"active"`, `"in_progress"`, `"emergency"`
- Bad: `"Active"`, `"InProgress"`, `"EMERGENCY"`

