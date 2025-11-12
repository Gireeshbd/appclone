# PrayScreen Production Roadmap
## Complete Guide to App Store & Play Store Launch

**Last Updated:** 2025-11-12
**Target Launch:** TBD
**Status:** Pre-Production

---

## 🚨 CRITICAL BLOCKERS (Must Complete First)

### 1. Native Project Initialization ⚠️ **HIGHEST PRIORITY**
**Status:** 🔴 NOT STARTED
**Issue:** iOS and Android directories are empty - no native code exists

**Required Actions:**
- [ ] Initialize React Native iOS project structure
- [ ] Initialize React Native Android project structure
- [ ] Configure Xcode project settings
- [ ] Configure Gradle build system
- [ ] Test basic app builds on both platforms

**Time Estimate:** 4-6 hours

---

### 2. Native Blocking Modules 🎯 **CORE FEATURE**
**Status:** 🔴 NOT STARTED
**Dependencies:** Native project must be initialized first

#### iOS Implementation (Screen Time API)
**Files to Create:**
- `ios/PrayScreen/ScreenTimeManager.swift` - Native module
- `ios/PrayScreen/ScreenTimeManager.m` - Bridge to JS
- `src/services/blockingService.ts` - Update to use real native calls

**Requirements:**
- Request Screen Time permission
- Implement app blocking functionality
- Handle iOS 15+ Screen Time API
- Create FamilyControls entitlement
- Test on physical device (Screen Time requires real device)

**Complexity:** HIGH
**Time Estimate:** 12-16 hours

#### Android Implementation (Accessibility Service)
**Files to Create:**
- `android/app/src/main/java/.../AppBlockingService.java`
- `android/app/src/main/java/.../BlockingNativeModule.java`
- `android/app/src/main/AndroidManifest.xml` - Add service declaration
- `android/app/src/main/res/xml/accessibility_service_config.xml`

**Requirements:**
- Request Accessibility permission
- Implement overlay detection
- Block app launches via UsageStatsManager
- Handle Android 12+ restrictions
- Test on multiple Android versions (10-14)

**Complexity:** HIGH
**Time Estimate:** 16-20 hours

---

### 3. App Configuration & Info
**Status:** 🟡 PARTIAL (app.json exists but needs completion)

**Required Updates:**
```json
{
  "name": "PrayScreen",
  "displayName": "PrayScreen - Prayer App Blocker",
  "bundleId": "com.prayscreen.app",  // MUST BE UNIQUE
  "version": "1.0.0",
  "buildNumber": "1"
}
```

**iOS Info.plist Additions:**
```xml
<key>NSUserTrackingUsageDescription</key>
<string>We track app usage to help you build better prayer habits.</string>

<key>NSFaceIDUsageDescription</key>
<string>Use Face ID to unlock apps after prayer.</string>

<key>NSScreenCaptureDescription</key>
<string>Required to monitor app usage for blocking.</string>
```

**Android Permissions:**
```xml
<uses-permission android:name="android.permission.PACKAGE_USAGE_STATS"/>
<uses-permission android:name="android.permission.BIND_ACCESSIBILITY_SERVICE"/>
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>
<uses-permission android:name="android.permission.INTERNET"/>
```

**Time Estimate:** 2-3 hours

---

## 💰 MONETIZATION SETUP

### 4. RevenueCat Configuration
**Status:** 🟡 PARTIAL (Service exists with mocks)
**Dependencies:** App must be registered in App Store Connect & Play Console

**Steps:**
1. Create RevenueCat account
2. Add iOS app (Bundle ID: com.prayscreen.app)
3. Add Android app (Package Name: com.prayscreen.app)
4. Create products in App Store Connect:
   - `premium_weekly`: $4.99/week auto-renewable subscription
   - `premium_annual`: $39.99/year auto-renewable subscription
5. Create products in Play Console:
   - Same product IDs as iOS
6. Configure entitlements in RevenueCat:
   - Entitlement ID: `premium`
   - Attach both products
7. Get RevenueCat API keys (Public SDK keys)
8. Update `src/services/revenueCatService.ts` with real API keys
9. Remove mock data from service
10. Test purchase flow in sandbox

**Environment Variables Needed:**
```env
REVENUECAT_IOS_API_KEY=appl_xxxxx
REVENUECAT_ANDROID_API_KEY=goog_xxxxx
```

**Time Estimate:** 6-8 hours (includes App Store/Play Console setup)

---

### 5. Google Mobile Ads (Free Tier)
**Status:** 🔴 NOT STARTED

**Steps:**
1. Create Google AdMob account
2. Register iOS app
3. Register Android app
4. Create ad units:
   - Banner ad (Home screen, bottom)
   - Interstitial ad (After completing prayer)
   - Rewarded ad (Optional: watch ad to skip prayer)
5. Get Ad Unit IDs
6. Update `react-native-google-mobile-ads` configuration
7. Implement ad display logic (only show for free tier)
8. Test ads in development mode

**Files to Update:**
- `src/screens/HomeScreen.tsx` - Add banner ad
- `src/screens/PrayerSessionScreen.tsx` - Show interstitial after completion
- Create new component: `src/components/AdBanner.tsx`

**Time Estimate:** 4-6 hours

---

## 📊 ANALYTICS & MONITORING

### 6. Crash Reporting & Analytics
**Status:** 🔴 NOT STARTED

**Option A: Firebase (Recommended)**
- Firebase Analytics (Free)
- Firebase Crashlytics (Free)
- Firebase Cloud Messaging (Push notifications)
- Firebase Remote Config (Feature flags)

**Option B: Sentry + Mixpanel**
- Sentry for crash reporting
- Mixpanel for product analytics

**Required Events to Track:**
- `prayer_started`
- `prayer_completed`
- `prayer_skipped`
- `app_blocked`
- `app_unlocked`
- `subscription_started`
- `subscription_cancelled`
- `verse_viewed`
- `custom_verse_added`

**Time Estimate:** 6-8 hours for Firebase setup

---

## 🎨 VISUAL ASSETS

### 7. App Icons
**Status:** 🔴 NOT STARTED

**Required Sizes:**
**iOS:**
- 1024x1024 (App Store)
- 180x180 (@3x iPhone)
- 120x120 (@2x iPhone)
- 167x167 (@2x iPad)
- 152x152 (@2x iPad)
- 76x76 (iPad)
- 60x60, 40x40, 29x29 (various)

**Android:**
- 512x512 (Play Store)
- 192x192 (xxxhdpi)
- 144x144 (xxhdpi)
- 96x96 (xhdpi)
- 72x72 (hdpi)
- 48x48 (mdpi)

**Design Requirements:**
- Dark background (matches app theme)
- Warm coral accent (#FF6A5A)
- Prayer/spiritual symbolism (hands, cross, dove, light)
- Clear and recognizable at small sizes
- No text (icon should be universal)

**Tools:** Figma, Sketch, or hire designer
**Time Estimate:** 8-12 hours (design + export)

---

### 8. Splash Screens
**Status:** 🔴 NOT STARTED

**iOS:**
- Use `LaunchScreen.storyboard`
- Match app background color
- Simple logo centered

**Android:**
- Use `drawable/launch_screen.xml`
- Match app background color
- Simple logo centered

**Library:** `react-native-splash-screen` or `react-native-bootsplash`

**Time Estimate:** 2-4 hours

---

## 🔐 PERMISSIONS & PRIVACY

### 9. Permission Handling Flow
**Status:** 🟡 PARTIAL (react-native-permissions installed but not implemented)

**Required Permissions:**
- **iOS Screen Time:** Request in onboarding
- **Android Accessibility:** Request in onboarding
- **Notifications:** Request after first prayer
- **App Tracking (iOS):** Optional for analytics

**Implementation:**
- Create `src/screens/OnboardingScreen.tsx`
- Create `src/components/PermissionRequest.tsx`
- Add permission status checks
- Handle denied permissions gracefully
- Provide deep links to Settings

**Time Estimate:** 6-8 hours

---

### 10. Privacy Policy & Terms of Service
**Status:** 🔴 NOT STARTED - **REQUIRED BY BOTH STORES**

**Privacy Policy Must Include:**
- What data is collected (app usage, prayer sessions)
- How data is used (analytics, personalization)
- Data retention policies
- User rights (delete data, export data)
- Third-party services (RevenueCat, AdMob, Firebase)
- GDPR/CCPA compliance
- Contact information

**Terms of Service Must Include:**
- Subscription terms (pricing, renewal, cancellation)
- Acceptable use policy
- Intellectual property rights
- Limitation of liability
- Dispute resolution

**Options:**
1. Use template generators (TermsFeed, iubenda)
2. Hire lawyer (recommended for paid app)
3. Use Termly.io (free with branding)

**Hosting:**
- Create website: prayscreen.com/privacy
- Or host on GitHub Pages

**Time Estimate:** 6-10 hours (with templates)

---

## 🏗️ CODE QUALITY & TESTING

### 11. Error Boundaries
**Status:** 🔴 NOT STARTED

**Files to Create:**
- `src/components/ErrorBoundary.tsx` - Catch React errors
- `src/screens/ErrorScreen.tsx` - User-friendly error UI
- `src/utils/errorHandler.ts` - Global error handler

**Implementation:**
- Wrap `<RootNavigator />` in ErrorBoundary
- Log errors to Crashlytics
- Show friendly error messages
- Provide "Try Again" and "Report" actions

**Time Estimate:** 3-4 hours

---

### 12. Loading States & Skeletons
**Status:** 🟡 PARTIAL (ActivityIndicators exist)

**Improvements Needed:**
- Create skeleton screens for HomeScreen
- Add shimmer effects
- Loading states for verse loading
- Connection lost indicators
- Retry mechanisms

**Files to Create:**
- `src/components/Skeleton.tsx`
- `src/components/ConnectionBanner.tsx`

**Time Estimate:** 4-6 hours

---

### 13. Offline Support
**Status:** 🟡 PARTIAL (Local storage works, but needs offline detection)

**Required:**
- Detect network state
- Queue actions when offline
- Sync when back online
- Cache verse library
- Show offline indicators

**Library:** `@react-native-community/netinfo`

**Time Estimate:** 6-8 hours

---

### 14. Unit & Integration Tests
**Status:** 🔴 NOT STARTED

**Test Coverage Goals:**
- Services: 80%+ coverage
- Utils: 90%+ coverage
- Components: 60%+ coverage

**Files to Create:**
```
src/__tests__/
├── services/
│   ├── verseService.test.ts
│   ├── sessionService.test.ts
│   └── blockingService.test.ts
├── utils/
│   └── time.test.ts
└── components/
    ├── Button.test.tsx
    └── Card.test.tsx
```

**Setup:**
- Jest already configured
- Add React Native Testing Library
- Add test scripts to package.json

**Time Estimate:** 16-24 hours

---

### 15. Performance Optimization
**Status:** 🟡 NEEDS REVIEW

**Checklist:**
- [ ] Use React.memo for expensive components
- [ ] Optimize FlatList with proper keys
- [ ] Enable Hermes engine
- [ ] Analyze bundle size
- [ ] Lazy load screens
- [ ] Optimize images (use WebP)
- [ ] Profile with Flipper

**Target Metrics:**
- App launch: <2s
- Screen transitions: <300ms
- Bundle size: <15MB

**Time Estimate:** 8-12 hours

---

## 🚀 BUILD & DEPLOYMENT

### 16. iOS Build Configuration
**Status:** 🔴 NOT STARTED

**Xcode Settings:**
- Set Bundle Identifier: `com.prayscreen.app`
- Set Display Name: `PrayScreen`
- Set Version: `1.0.0`
- Set Build Number: `1`
- Configure Signing & Capabilities:
  - Automatic signing with team
  - Add Family Controls entitlement
  - Add App Groups capability (if needed for extensions)
- Set Deployment Target: iOS 14.0+
- Configure Release scheme

**Files to Update:**
- `ios/PrayScreen/Info.plist`
- `ios/PrayScreen.xcodeproj/project.pbxproj`

**Time Estimate:** 4-6 hours

---

### 17. Android Build Configuration
**Status:** 🔴 NOT STARTED

**Gradle Settings:**
- Set applicationId: `com.prayscreen.app`
- Set versionName: `1.0.0`
- Set versionCode: `1`
- Configure signing with keystore
- Enable Hermes
- Enable ProGuard for release
- Configure product flavors (if needed)

**Files to Update:**
- `android/app/build.gradle`
- `android/gradle.properties`
- `android/app/proguard-rules.pro`

**Time Estimate:** 4-6 hours

---

### 18. Code Signing
**Status:** 🔴 NOT STARTED

#### iOS Certificates
**Required:**
1. Apple Developer Account ($99/year)
2. Development Certificate
3. Distribution Certificate
4. Provisioning Profiles (Development & App Store)
5. Push Notification Certificate (if using push)

**Steps:**
1. Create certificates in Apple Developer Portal
2. Download and install in Keychain
3. Create provisioning profiles
4. Configure in Xcode

#### Android Keystore
**Required:**
1. Generate keystore file
2. Store credentials securely
3. Configure Gradle signing config

**Command:**
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore prayscreen.keystore \
  -alias prayscreen -keyalg RSA -keysize 2048 -validity 10000
```

**Security:** Never commit keystore to git!

**Time Estimate:** 3-5 hours

---

### 19. App Store Connect Setup
**Status:** 🔴 NOT STARTED

**Steps:**
1. Create App Store Connect account (needs Apple Developer membership)
2. Create new app
3. Fill app information:
   - Name: PrayScreen
   - Bundle ID: com.prayscreen.app
   - Primary Language: English
   - Category: Lifestyle > Health & Fitness
   - Age Rating: 4+ (No objectionable content)
4. Upload screenshots (6.7", 6.5", 5.5" required)
5. Write app description (max 4000 chars)
6. Add keywords (max 100 chars)
7. Set pricing: Free with in-app purchases
8. Configure in-app purchases
9. Set up TestFlight for beta testing

**Time Estimate:** 6-10 hours

---

### 20. Google Play Console Setup
**Status:** 🔴 NOT STARTED

**Steps:**
1. Create Google Play Developer account ($25 one-time)
2. Create new app
3. Fill app details:
   - Name: PrayScreen
   - Package name: com.prayscreen.app
   - Category: Lifestyle
   - Content rating questionnaire
4. Upload screenshots (Phone, 7" tablet, 10" tablet)
5. Create feature graphic (1024x500)
6. Write short description (max 80 chars)
7. Write full description (max 4000 chars)
8. Set pricing: Free with in-app purchases
9. Configure in-app products
10. Set up internal testing track

**Time Estimate:** 6-10 hours

---

### 21. Marketing Assets
**Status:** 🔴 NOT STARTED

**App Store Screenshots (Required):**
- iPhone 6.7" (3 minimum, 10 maximum)
- iPhone 6.5" (3 minimum, 10 maximum)
- iPhone 5.5" (3 minimum, 10 maximum)
- iPad Pro 12.9" (optional but recommended)

**Play Store Screenshots (Required):**
- Phone: 1080x1920 (2 minimum, 8 maximum)
- 7" Tablet: 1920x1200 (optional)
- 10" Tablet: 2560x1600 (optional)

**Feature Graphic (Play Store):**
- 1024x500 PNG or JPG

**Promotional Video (Optional but recommended):**
- 30-60 seconds
- Show key features
- Upload to YouTube, link in stores

**Screenshot Content Ideas:**
1. Home screen with blocked apps
2. Prayer session with verse and timer
3. Streak statistics
4. Paywall with pricing
5. Settings and customization

**Tools:** Figma, Sketch, Screenshots.pro, Previewed.app

**Time Estimate:** 12-20 hours

---

### 22. App Store Listing Copy
**Status:** 🔴 NOT STARTED

**App Name (30 chars):**
"PrayScreen - Prayer App Block"

**Subtitle (30 chars, iOS only):**
"Turn Screen Time to Prayer Time"

**Promotional Text (170 chars, iOS only):**
"Transform your relationship with your phone. Replace mindless scrolling with meaningful prayer. Block distracting apps until you spend time in God's Word."

**Description (4000 chars):**
```
🙏 TURN SCREEN TIME INTO PRAYER TIME

PrayScreen helps you build a consistent prayer life by blocking distracting apps until you spend time reading Scripture and praying.

HOW IT WORKS:
1. Select apps you want to block (social media, games, etc.)
2. When you try to open a blocked app, PrayScreen appears
3. Read a Bible verse or prayer for 30-60 seconds
4. Apps unlock after your prayer time is complete

KEY FEATURES:
✨ Smart App Blocking - Block any app and create healthy boundaries
📖 500+ Bible Verses - Curated verses for strength, peace, wisdom, and more
⏱️ Prayer Timer - Customizable reading time (30s-5min)
🔥 Streak Tracking - Build consistency with daily streak goals
📊 Detailed Statistics - See your prayer growth over time
🌙 Night Mode - Beautiful dark theme for prayer at any hour
☁️ Cloud Sync - Access your progress across devices (Premium)
🎨 Custom Prayers - Add your own prayers and devotions (Premium)

FREE TIER:
• Block up to 3 apps
• Access to 50 verses
• Basic statistics
• Ad-supported

PREMIUM:
• Block unlimited apps
• Full library of 500+ verses
• Custom prayers and content
• Advanced analytics
• Cloud sync
• No ads
• Priority support

SUBSCRIPTIONS:
• Weekly: $4.99/week
• Annual: $39.99/year (Save 83%!)

WHY PRAYSCREEN?
We believe your phone should help, not hinder, your spiritual growth. PrayScreen combines practical app blocking with Biblical content to transform your screen time into an opportunity for prayer and reflection.

PERFECT FOR:
• Anyone struggling with phone addiction
• Christians wanting to build a daily prayer habit
• Parents teaching children healthy phone use
• Anyone seeking more peace and less distraction

"I was spending 4+ hours a day on social media. PrayScreen helped me replace that time with prayer. Life-changing!" - Sarah M.

TECHNICAL NOTES:
• Uses iOS Screen Time API / Android Accessibility Service
• Works with any installed app
• Requires necessary permissions to function
• No personal data shared or sold

Download PrayScreen today and start your journey toward a more intentional, prayerful life.

Privacy Policy: https://prayscreen.com/privacy
Terms of Service: https://prayscreen.com/terms
Support: support@prayscreen.com
```

**Keywords (100 chars):**
"prayer,bible,app blocker,screen time,christian,devotional,faith,spiritual,distraction,focus"

**Time Estimate:** 4-6 hours

---

### 23. Final Testing Checklist
**Status:** 🔴 NOT STARTED

**Functional Testing:**
- [ ] App installs successfully
- [ ] App launches without crashing
- [ ] Onboarding flow works
- [ ] Permission requests work
- [ ] App blocking works (iOS & Android)
- [ ] Prayer timer works accurately
- [ ] Verse display works
- [ ] Statistics calculate correctly
- [ ] Subscription flow works
- [ ] Purchase restores work
- [ ] Ads display (free tier)
- [ ] Settings save properly
- [ ] Deep links work
- [ ] Push notifications work
- [ ] Offline mode works
- [ ] App doesn't crash on edge cases

**Device Testing:**
- [ ] iPhone SE (small screen)
- [ ] iPhone 14 Pro (notch)
- [ ] iPhone 15 Pro Max (dynamic island)
- [ ] iPad (tablet layout)
- [ ] Android 10, 11, 12, 13, 14
- [ ] Various Android manufacturers (Samsung, Pixel, OnePlus)

**Performance Testing:**
- [ ] App launches in <2s
- [ ] No memory leaks
- [ ] Battery usage acceptable
- [ ] Network usage acceptable
- [ ] No ANR (Application Not Responding)

**Time Estimate:** 16-24 hours

---

### 24. Beta Testing (TestFlight & Internal Testing)
**Status:** 🔴 NOT STARTED

**Steps:**
1. Upload build to TestFlight (iOS)
2. Upload build to Internal Testing (Android)
3. Invite beta testers (20-50 people)
4. Collect feedback
5. Fix critical issues
6. Iterate and retest
7. Get final approval from testers

**Duration:** 2-4 weeks

---

### 25. Final Submission
**Status:** 🔴 NOT STARTED

**iOS App Store:**
1. Archive build in Xcode
2. Upload to App Store Connect
3. Submit for review
4. Answer App Review questions
5. Wait for review (1-7 days typically)
6. Address any rejection reasons
7. Resubmit if needed

**Google Play Store:**
1. Generate signed APK/AAB
2. Upload to Play Console
3. Complete content rating
4. Submit for review
5. Wait for review (hours to days)
6. Address any policy violations
7. Publish when approved

**Time Estimate:** 1-2 weeks (including review time)

---

## 📈 PRIORITY MATRIX

### Phase 1: Foundation (Weeks 1-2)
**MUST COMPLETE BEFORE ANYTHING ELSE**
1. ✅ Initialize iOS/Android native projects
2. ✅ Basic app builds successfully
3. ✅ Test on physical devices

### Phase 2: Core Features (Weeks 3-5)
**BLOCKING FUNCTIONALITY - THE MAIN FEATURE**
1. ✅ iOS Screen Time blocking
2. ✅ Android Accessibility blocking
3. ✅ Permission handling flow
4. ✅ Error boundaries and error handling

### Phase 3: Monetization (Week 6)
**REVENUE FEATURES**
1. ✅ RevenueCat integration
2. ✅ Google Mobile Ads
3. ✅ Test purchase flows

### Phase 4: Polish & Quality (Weeks 7-8)
**USER EXPERIENCE**
1. ✅ Loading states and skeletons
2. ✅ Offline support
3. ✅ Analytics and crash reporting
4. ✅ Performance optimization

### Phase 5: Visual Assets (Week 9)
**BRAND & MARKETING**
1. ✅ App icons
2. ✅ Splash screens
3. ✅ Screenshots
4. ✅ Marketing copy

### Phase 6: Legal & Setup (Week 10)
**COMPLIANCE**
1. ✅ Privacy Policy & Terms
2. ✅ App Store Connect setup
3. ✅ Play Console setup
4. ✅ Code signing

### Phase 7: Testing (Weeks 11-12)
**QUALITY ASSURANCE**
1. ✅ Write tests
2. ✅ Manual testing
3. ✅ Beta testing
4. ✅ Fix critical bugs

### Phase 8: Launch (Week 13)
**GO LIVE**
1. ✅ Final submission
2. ✅ Monitor reviews
3. ✅ Address issues

---

## 📊 RESOURCE REQUIREMENTS

### Developer Time
- **Solo Developer:** 250-350 hours (10-14 weeks full-time)
- **With Team:** 150-200 hours (6-8 weeks)

### Financial Costs
- Apple Developer Account: $99/year
- Google Play Developer Account: $25 one-time
- Design Tools (Figma, etc.): $0-50/month
- RevenueCat: Free tier sufficient initially
- Firebase: Free tier sufficient initially
- Privacy Policy Generator: $0-50 one-time
- Domain & Hosting: $12-50/year
- **Total First Year:** ~$200-350

### External Services (Optional)
- Hire Designer: $500-2000 for icons and assets
- Hire Lawyer: $500-1500 for legal documents
- Beta Testers: Free or $50-200 in incentives
- Marketing: Variable

---

## 🎯 SUCCESS METRICS

### Launch Goals
- 0 crashes on launch day
- 4.5+ star rating in first week
- 1000 downloads in first month
- 5% free-to-paid conversion rate
- <5% churn rate

### Technical KPIs
- App crash rate: <0.1%
- ANR rate: <0.1%
- API success rate: >99%
- Average session length: 5+ minutes
- User retention (D1): >40%

---

## 🆘 KNOWN RISKS

### High Risk
1. **Apple/Google Rejection** - App blocking functionality may be questioned
   - Mitigation: Clear permissions, transparent descriptions, follow guidelines exactly
2. **Screen Time API Limitations** - iOS restrictions on app control
   - Mitigation: Research API thoroughly, test extensively
3. **Android Fragmentation** - Different behavior across devices
   - Mitigation: Test on many devices, use compatibility libraries

### Medium Risk
1. **RevenueCat Integration Issues** - Subscription bugs
   - Mitigation: Thorough testing, sandbox testing
2. **Performance Issues** - App too slow
   - Mitigation: Profile early, optimize continuously

### Low Risk
1. **Design Changes** - Might need redesign
   - Mitigation: Follow design system, iterate based on feedback

---

## 📝 NOTES

- This roadmap assumes a solo developer or small team
- Timeline estimates are conservative and include buffer time
- Some tasks can be done in parallel
- User feedback may require additional iterations
- App Store review times are unpredictable
- Both stores may require changes before approval

---

**Document Version:** 1.0
**Next Review:** After Phase 1 completion
