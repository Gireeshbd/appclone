# PrayScreen - Prayer-Based App Blocker

A React Native mobile application that helps users build spiritual discipline by blocking access to distracting apps until they complete a prayer or Bible reading session.

## 🎯 Project Overview

PrayScreen transforms screen time into prayer time. When users try to open blocked apps, they're redirected to read a Bible verse or prayer for a set duration before unlocking.

### Key Features

- **App Blocking**: Block distracting apps on both iOS and Android
- **Prayer Sessions**: Read Bible verses/prayers to unlock apps
- **Subscription Tiers**:
  - Free: Block 3 apps, basic verses, ads
  - Premium Weekly: $4.99/week - unlimited apps, full library, no ads
  - Premium Yearly: $39.99/year - best value option
- **Progress Tracking**: Streaks, statistics, and achievements
- **Dark Theme**: Beautiful warm coral design system

## 📁 Project Structure

```
PrayScreen/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Text.tsx
│   │   └── Screen.tsx
│   ├── screens/          # App screens (to be implemented)
│   ├── navigation/       # Navigation setup
│   │   ├── RootNavigator.tsx
│   │   └── MainTabNavigator.tsx
│   ├── store/            # Zustand state management
│   │   ├── userStore.ts
│   │   ├── appStore.ts
│   │   └── subscriptionStore.ts
│   ├── types/            # TypeScript type definitions
│   │   ├── user.ts
│   │   ├── app.ts
│   │   ├── verse.ts
│   │   ├── session.ts
│   │   └── subscription.ts
│   ├── theme/            # Design system
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── motion.ts
│   ├── services/         # API and native module services
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   └── App.tsx           # Main app component
├── ios/                  # iOS native code
├── android/              # Android native code
└── docs/                 # Project documentation
    ├── DATA_STRUCTURES.md
    ├── PRODUCT_SPECIFICATION.md
    ├── REVENUECAT_INTEGRATION.md
    └── JSON_EXAMPLES.md
```

## 🎨 Design System

Based on `design(1).json` - a dark, warm coral aesthetic:

- **Colors**: Dark backgrounds (#0E1217) with coral accents (#FF6A5A)
- **Typography**: Serif for headlines (Georgia), sans-serif for body (System/Roboto)
- **Components**: Rounded cards (24px), smooth animations, iOS-native feel

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- React Native development environment
  - iOS: Xcode 14+, CocoaPods
  - Android: Android Studio, JDK 17
- npm or yarn

### Installation

```bash
# Clone the repository
cd PrayScreen

# Install dependencies
npm install

# iOS only - install CocoaPods
cd ios && pod install && cd ..

# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## 🛠️ Tech Stack

### Core

- **React Native 0.76.3** - Cross-platform framework
- **TypeScript** - Type safety
- **React Navigation 7** - Navigation

### State & Storage

- **Zustand** - State management
- **MMKV** - Fast local storage
- **AsyncStorage** - Persistent storage fallback

### Subscriptions & Monetization

- **RevenueCat** - Subscription management
- **Google Mobile Ads** - Ad integration for free tier

### Native Features

- **iOS**: Screen Time API for app blocking
- **Android**: Accessibility Service API for app blocking
- **Notifee** - Local notifications
- **React Native Permissions** - Permission handling

### UI & Animations

- **React Native Reanimated** - Smooth animations
- **React Native Gesture Handler** - Touch interactions
- **React Native SVG** - Vector graphics
- **React Native Linear Gradient** - Beautiful gradients

## 📦 Key Dependencies

```json
{
  "react": "18.3.1",
  "react-native": "0.76.3",
  "@react-navigation/native": "^7.0.13",
  "zustand": "^5.0.3",
  "react-native-mmkv": "^3.1.0",
  "react-native-purchases": "^8.3.1",
  "react-native-google-mobile-ads": "^15.4.0",
  "@notifee/react-native": "^9.3.0",
  "react-native-reanimated": "^3.16.6"
}
```

## 🏗️ Development Status

### ✅ Completed

- [x] Project setup with TypeScript
- [x] Design system implementation (colors, typography, spacing)
- [x] Type definitions for all data models
- [x] State management stores (User, Apps, Subscription)
- [x] Navigation structure (Stack + Tab navigators)
- [x] Reusable UI components (Button, Card, Text, Screen)
- [x] Project configuration (Babel, ESLint, Prettier, Metro)

### 🚧 In Progress / Pending

- [ ] Onboarding flow screens
- [ ] iOS Screen Time API native module
- [ ] Android Accessibility Service native module
- [ ] Verse library and content management
- [ ] Prayer/unlock flow screen with timer
- [ ] App selection UI
- [ ] RevenueCat integration
- [ ] Paywall screen
- [ ] Ad integration
- [ ] Settings screen
- [ ] Analytics and progress tracking
- [ ] Notification system
- [ ] Achievements system
- [ ] Backend integration (Firebase/Supabase)

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run linter
npm run lint

# Format code
npm run format
```

## 📱 Native Setup

### iOS

1. Configure Screen Time API entitlements
2. Add Screen Time capability in Xcode
3. Update Info.plist with usage descriptions
4. Configure RevenueCat in App Store Connect

### Android

1. Enable Accessibility Service in AndroidManifest.xml
2. Create Accessibility Service class
3. Configure Usage Stats API permissions
4. Set up Google Play billing
5. Configure RevenueCat in Google Play Console

## 💰 Monetization

### Subscription Tiers

**Free Tier**
- Block up to 3 apps
- Basic verse library (100 verses)
- 30-second reading time (fixed)
- Ads between unlock sessions

**Premium Weekly - $4.99/week**
- Block unlimited apps
- Full verse library (500+ verses)
- Custom reading time
- No ads
- Advanced scheduling
- Analytics

**Premium Yearly - $39.99/year** (Best Value!)
- All Premium Weekly features
- Save 83% compared to weekly
- Priority support

### RevenueCat Product IDs

- `premium_weekly` - $4.99/week
- `premium_annual` - $39.99/year

## 📖 Documentation

See the root directory documentation files:

- **PRODUCT_SPECIFICATION.md** - Complete feature specification
- **DATA_STRUCTURES.md** - Database schemas and data models
- **REVENUECAT_INTEGRATION.md** - Subscription implementation guide
- **JSON_EXAMPLES.md** - Example data structures

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linter
4. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 🙏 Credits

Inspired by PrayScreen and similar faith-based productivity apps.

---

## Next Steps for Development

1. **Implement Native Modules**
   - iOS: Create Screen Time API bridge
   - Android: Create Accessibility Service

2. **Build Core Screens**
   - Onboarding flow
   - Home screen with blocked apps
   - Prayer/unlock session screen
   - Settings screen

3. **Integrate RevenueCat**
   - Set up products in RC dashboard
   - Implement purchase flow
   - Test subscriptions

4. **Add Verse Library**
   - Create verse database
   - Implement verse selection logic
   - Add favorites and categories

5. **Implement Analytics**
   - Track prayer sessions
   - Calculate streaks
   - Show progress charts

6. **Testing & Polish**
   - Test app blocking thoroughly
   - Optimize performance
   - Fix bugs
   - Beta testing

## Support

For issues or questions, please open a GitHub issue or contact the development team.

---

**Built with ❤️ and 🙏 using React Native**
