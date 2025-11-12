# Prayer-Based App Blocker - Product Specification Document

## Executive Summary

This is a mobile application (iOS & Android) that helps users build spiritual discipline by blocking access to selected apps until they complete a prayer or Bible reading session. The app combines digital wellbeing with faith-based practices to reduce mindless scrolling and increase spiritual engagement.

---

## Core Concept

When a user attempts to open a blocked app, they are redirected to your app where they must:
1. Read a Bible verse/prayer passage
2. Spend a minimum amount of time reading (e.g., 30 seconds to 2 minutes)
3. Complete the reading session
4. Only then can they access the blocked app(s)

---

## Key Features to Build

### 1. App Blocking System
- **Selection Interface**: Users can select which apps to block from their installed apps
- **Block Schedule**: Users can set when blocking is active (24/7, specific hours, specific days)
- **Immediate Blocking**: Once enabled, selected apps are blocked immediately
- **Platform Integration**: 
  - iOS: Uses Screen Time API
  - Android: Uses Accessibility Service API

### 2. Unlock Flow (Prayer/Reading Session)
- **Interception**: When user tries to open blocked app, redirect to your app
- **Content Display**: Show a Bible verse or prayer passage
- **Minimum Reading Time**: Enforce minimum time (30s-120s configurable per user)
- **Timer Display**: Visual countdown showing time remaining
- **Completion**: After time expires, show "Unlock" button
- **Unlock Duration**: Apps unlock for a set period (configurable: 5min, 15min, 30min, 1hr, rest of day)
- **Re-lock**: Apps automatically re-lock after unlock duration expires

### 3. Content Library (Bible Verses & Prayers)
- **Daily Verse**: One featured verse per day
- **Verse Categories**: Organize by theme (strength, peace, gratitude, temptation, etc.)
- **Verse Rotation**: Ensure users don't see the same verse repeatedly
- **Reading History**: Track which verses user has read
- **Favorites**: Allow users to mark favorite verses
- **Custom Content**: Premium users can add their own prayers/verses

### 4. User Settings & Customization
- **App Selection**: Choose which apps to block
- **Block Schedule**: Set active hours for blocking
- **Reading Duration**: Set minimum reading time (30s-120s)
- **Unlock Duration**: Set how long apps stay unlocked
- **Theme**: Light/Dark mode
- **Notifications**: Prayer reminders, daily verse notifications
- **Bypass Emergency**: Optional emergency override (with warning/guilt message)

### 5. Analytics & Progress Tracking
- **Daily Stats**:
  - Number of prayer sessions completed
  - Total time spent reading
  - Apps that were blocked attempts
  - Success rate (completed readings vs bypasses)
- **Weekly/Monthly Reports**: Trends and patterns
- **Streak Tracking**: Days of consistent use
- **Milestones**: Achievements (7 days, 30 days, 100 readings, etc.)

### 6. Monetization (RevenueCat Integration)
- **Free Tier**:
  - Block up to 3 apps
  - Access to basic verse library (100 verses)
  - Daily featured verse
  - 30-second minimum reading time (fixed)
  - Ads between unlock sessions (optional)
  
- **Premium Tier** (Monthly/Annual Subscription):
  - Block unlimited apps
  - Access to full verse library (500+ verses)
  - Custom prayers/content
  - Advanced scheduling (different blocks for different days)
  - Adjustable reading time
  - No ads
  - Progress analytics and reports
  - Custom themes
  - Priority support

### 7. Onboarding Experience
1. **Welcome Screen**: Explain app purpose
2. **Permission Requests**: 
   - Screen Time API (iOS) / Accessibility Service (Android)
   - Notifications
3. **App Selection**: Guide user to select apps to block
4. **First Prayer**: Show sample prayer session
5. **Schedule Setup**: Help set blocking schedule
6. **Paywall**: Show premium features (RevenueCat)
7. **Done**: Confirm blocking is active

---

## Technical Requirements

### Platform-Specific APIs

#### iOS
- **Screen Time API**: Required for app blocking
- **App Extensions**: For interception and monitoring
- **Local Notifications**: For reminders and daily verses
- **SwiftUI/UIKit**: UI framework

#### Android
- **Accessibility Service API**: Required for app blocking
- **Usage Stats API**: For tracking app usage
- **Foreground Service**: To monitor app launches
- **WorkManager**: For background tasks

### Backend Services (Optional but Recommended)
- **User Authentication**: Firebase Auth or similar
- **Content Management**: Store/sync verses and prayers
- **Analytics**: Track usage patterns (anonymized)
- **RevenueCat**: Subscription management
- **Push Notifications**: For reminders and engagement

### Data Storage
- **Local Storage**: 
  - User preferences
  - Blocked apps list
  - Reading history
  - Unlocked apps cache
- **Cloud Sync** (Premium):
  - Sync settings across devices
  - Backup reading history

---

## User Flow Diagrams

### Primary Flow: Blocked App Access
```
User taps blocked app
    ↓
System intercepts launch
    ↓
Redirect to Prayer App
    ↓
Display Bible verse
    ↓
Start reading timer (30s-120s)
    ↓
[User must wait and read]
    ↓
Timer completes
    ↓
"Unlock" button appears
    ↓
User taps Unlock
    ↓
Apps unlocked for set duration (5min-1hr)
    ↓
[User can use blocked apps]
    ↓
Duration expires
    ↓
Apps re-lock automatically
```

### Secondary Flow: Premium Upgrade
```
User hits free tier limit
    ↓
Show paywall (RevenueCat)
    ↓
Display premium features
    ↓
User selects plan
    ↓
RevenueCat handles payment
    ↓
Unlock premium features
    ↓
Sync entitlement status
```

---

## Success Metrics

### User Engagement
- Daily Active Users (DAU)
- Prayer sessions completed per day
- Average reading time per session
- Retention rate (Day 1, Day 7, Day 30)

### Monetization
- Conversion rate (Free → Premium)
- Monthly Recurring Revenue (MRR)
- Average Revenue Per User (ARPU)
- Churn rate

### Spiritual Impact
- User-reported spiritual growth
- Streak length
- Reduced screen time on blocked apps

---

## Competitive Differentiation

### vs PrayScreen
- **Improvements to Consider**:
  - Better reliability (users complain about bugs)
  - Clearer paywall restoration
  - More verse categories
  - Better onboarding
  - Smoother unlock flow
  - More customization options

### Unique Value Proposition
- "Transform your screen time into prayer time"
- "Build spiritual discipline one unlock at a time"
- "Stop mindless scrolling, start mindful praying"

---

## Development Phases

### Phase 1: MVP (6-8 weeks)
- Basic app blocking (3 apps max)
- Simple verse library (50 verses)
- Fixed 30s reading time
- Basic unlock flow
- iOS OR Android (pick one)
- RevenueCat integration (one subscription tier)

### Phase 2: Core Features (4-6 weeks)
- Full verse library (300+ verses)
- Customizable settings
- Analytics dashboard
- Both iOS and Android
- Multiple subscription tiers
- Daily notifications

### Phase 3: Enhanced Features (4-6 weeks)
- Custom prayers/content
- Advanced scheduling
- Streak tracking and achievements
- Social features (share verses, pray with friends)
- Widget support

### Phase 4: Growth & Optimization (Ongoing)
- A/B testing
- Content expansion
- Performance optimization
- Marketing features (referrals, challenges)

---

## Risk Mitigation

### Technical Risks
- **Platform API Changes**: iOS/Android may change blocking APIs
  - *Mitigation*: Stay updated with platform changes, have fallback methods
  
- **Permission Denial**: Users may not grant required permissions
  - *Mitigation*: Clear education on why permissions are needed, graceful degradation

### Business Risks
- **Market Competition**: Multiple similar apps exist
  - *Mitigation*: Focus on better UX, reliability, and unique features
  
- **User Retention**: Users may uninstall after initial use
  - *Mitigation*: Strong onboarding, notification strategy, demonstrate value

### Legal/Privacy Risks
- **Data Privacy**: Sensitive data about app usage and reading habits
  - *Mitigation*: Privacy-first approach, minimal data collection, clear privacy policy
  
- **Accessibility API Misuse** (Android): Google scrutinizes accessibility service apps
  - *Mitigation*: Clear explanation in Play Store listing, proper use of API

---

## Next Steps

1. **Review this specification** and provide feedback
2. **Review the data structures document** (separate file)
3. **Set up development environment**
4. **Create wireframes/mockups** for key screens
5. **Set up RevenueCat account** and configure products
6. **Begin Phase 1 development**
7. **Test with beta users**
8. **Launch MVP**

---

## Questions to Consider

1. Will you target iOS first, Android first, or both simultaneously?
2. What will be the pricing for premium subscription? (Suggest: $4.99/month, $29.99/year)
3. Will you include ads in free tier?
4. What denomination/style of Bible verses? (e.g., ESV, NIV, KJV)
5. Will you support multiple languages eventually?
6. How strict should the bypass/emergency override be?
7. Will you track any usage analytics? What about privacy?

