# RevenueCat Integration Guide

## Overview
This document explains how to integrate RevenueCat for subscription management and paywall implementation in your Prayer-Based App Blocker.

---

## Why RevenueCat?

RevenueCat provides:
- **Cross-platform subscription management** (iOS, Android, Web)
- **Server-side receipt validation** (prevents piracy)
- **Subscription status tracking** across all devices
- **Analytics and insights** about your revenue
- **Webhook integration** for real-time subscription events
- **A/B testing** for paywalls and pricing
- **Grace periods** and billing retry handling
- **Refund detection**

---

## Setup Steps

### 1. Create RevenueCat Account

1. Go to [RevenueCat](https://www.revenuecat.com/)
2. Sign up for a free account
3. Create a new project for your app
4. Note your **Public API Key** (you'll need this in your mobile app)

### 2. Configure App Store Connect (iOS)

1. Create your in-app purchase products in App Store Connect
2. Add shared secret to RevenueCat
3. Link App Store Connect to RevenueCat

**Product IDs to create:**
- `premium_monthly` - Monthly subscription ($4.99)
- `premium_annual` - Annual subscription ($29.99, saves 50%)
- `premium_lifetime` - Lifetime access ($99.99) (optional)

### 3. Configure Google Play Console (Android)

1. Create subscription products in Google Play Console
2. Link Google Play to RevenueCat
3. Configure service account credentials

**Product IDs should match iOS:**
- `premium_monthly`
- `premium_annual`
- `premium_lifetime`

### 4. Create Entitlements

In RevenueCat dashboard, create an entitlement called **"premium"** and attach all your products to it.

**Why Entitlements?**
Instead of checking `if (user purchased premium_monthly)`, you check `if (user has premium entitlement)`. This makes it easy to add new products without code changes.

### 5. Create Offerings

Create an offering called **"default"** with two packages:
- **Monthly Package**: $4.99/month
- **Annual Package**: $29.99/year (Best Value!)

You can create multiple offerings for A/B testing different prices or package combinations.

---

## Mobile App Integration

### iOS (Swift)

**Installation:**
```swift
// In your Podfile
pod 'RevenueCat'

// Or with Swift Package Manager
dependencies: [
    .package(url: "https://github.com/RevenueCat/purchases-ios.git", from: "4.0.0")
]
```

**Configuration:**
```swift
import RevenueCat

// In AppDelegate or App struct
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    
    // Configure RevenueCat
    Purchases.logLevel = .debug // Only during development
    Purchases.configure(withAPIKey: "your_public_api_key_here")
    
    // Identify user (use your user ID)
    if let userId = getCurrentUserId() {
        Purchases.shared.logIn(userId) { (purchaserInfo, created, error) in
            // User identified
        }
    }
    
    return true
}
```

**Check Subscription Status:**
```swift
func checkSubscriptionStatus() {
    Purchases.shared.getCustomerInfo { (customerInfo, error) in
        if let error = error {
            print("Error fetching customer info: \\(error)")
            return
        }
        
        // Check if user has premium entitlement
        if customerInfo?.entitlements["premium"]?.isActive == true {
            // User is subscribed to premium
            self.unlockPremiumFeatures()
        } else {
            // User is on free tier
            self.showFreeTierUI()
        }
    }
}
```

**Display Paywall:**
```swift
func showPaywall() {
    Purchases.shared.getOfferings { (offerings, error) in
        if let error = error {
            print("Error fetching offerings: \\(error)")
            return
        }
        
        guard let offering = offerings?.current else {
            print("No current offering configured")
            return
        }
        
        // offering.availablePackages contains your monthly/annual packages
        self.presentPaywallViewController(with: offering)
    }
}
```

**Handle Purchase:**
```swift
func purchasePackage(_ package: Package) {
    Purchases.shared.purchase(package: package) { (transaction, customerInfo, error, userCancelled) in
        
        if userCancelled {
            print("User cancelled purchase")
            return
        }
        
        if let error = error {
            print("Purchase failed: \\(error)")
            self.showErrorAlert(error)
            return
        }
        
        // Check if premium is now active
        if customerInfo?.entitlements["premium"]?.isActive == true {
            // Success! User is now premium
            self.unlockPremiumFeatures()
            self.showSuccessAlert()
        }
    }
}
```

**Restore Purchases:**
```swift
func restorePurchases() {
    Purchases.shared.restorePurchases { (customerInfo, error) in
        if let error = error {
            print("Restore failed: \\(error)")
            return
        }
        
        if customerInfo?.entitlements["premium"]?.isActive == true {
            // Subscription restored
            self.unlockPremiumFeatures()
            self.showRestoreSuccessAlert()
        } else {
            // No active subscription found
            self.showNoSubscriptionAlert()
        }
    }
}
```

---

### Android (Kotlin)

**Installation:**
```kotlin
// In build.gradle (app level)
dependencies {
    implementation 'com.revenuecat.purchases:purchases:7.0.0'
}
```

**Configuration:**
```kotlin
import com.revenuecat.purchases.Purchases
import com.revenuecat.purchases.PurchasesConfiguration

// In Application class or MainActivity onCreate
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        
        // Configure RevenueCat
        Purchases.debugLogsEnabled = true // Only during development
        Purchases.configure(
            PurchasesConfiguration.Builder(this, "your_public_api_key_here")
                .build()
        )
        
        // Identify user
        val userId = getCurrentUserId()
        if (userId != null) {
            Purchases.sharedInstance.logIn(
                userId,
                { customerInfo, created ->
                    // User identified
                }
            ) { error ->
                // Error
            }
        }
    }
}
```

**Check Subscription Status:**
```kotlin
fun checkSubscriptionStatus() {
    Purchases.sharedInstance.getCustomerInfo({ customerInfo ->
        // Check if user has premium entitlement
        if (customerInfo.entitlements["premium"]?.isActive == true) {
            // User is subscribed to premium
            unlockPremiumFeatures()
        } else {
            // User is on free tier
            showFreeTierUI()
        }
    }, { error ->
        // Error fetching customer info
        Log.e("RevenueCat", "Error: ${error.message}")
    })
}
```

**Display Paywall:**
```kotlin
fun showPaywall() {
    Purchases.sharedInstance.getOfferings({ offerings ->
        offerings.current?.let { offering ->
            // offering.availablePackages contains your monthly/annual packages
            presentPaywallUI(offering)
        } ?: run {
            Log.e("RevenueCat", "No current offering configured")
        }
    }, { error ->
        Log.e("RevenueCat", "Error fetching offerings: ${error.message}")
    })
}
```

**Handle Purchase:**
```kotlin
fun purchasePackage(activity: Activity, packageToPurchase: Package) {
    Purchases.sharedInstance.purchase(
        PurchaseParams.Builder(activity, packageToPurchase).build(),
        { storeTransaction, customerInfo ->
            // Check if premium is now active
            if (customerInfo.entitlements["premium"]?.isActive == true) {
                // Success! User is now premium
                unlockPremiumFeatures()
                showSuccessAlert()
            }
        },
        { error, userCancelled ->
            if (userCancelled) {
                Log.d("RevenueCat", "User cancelled purchase")
            } else {
                Log.e("RevenueCat", "Purchase failed: ${error.message}")
                showErrorAlert(error)
            }
        }
    )
}
```

**Restore Purchases:**
```kotlin
fun restorePurchases() {
    Purchases.sharedInstance.restorePurchases({ customerInfo ->
        if (customerInfo.entitlements["premium"]?.isActive == true) {
            // Subscription restored
            unlockPremiumFeatures()
            showRestoreSuccessAlert()
        } else {
            // No active subscription found
            showNoSubscriptionAlert()
        }
    }, { error ->
        Log.e("RevenueCat", "Restore failed: ${error.message}")
    })
}
```

---

## Backend Integration (Webhooks)

### Setup Webhook

1. Go to RevenueCat Dashboard → Integrations → Webhooks
2. Add your webhook URL: `https://your-api.com/webhooks/revenuecat`
3. Select events to receive:
   - ✅ Initial Purchase
   - ✅ Renewal
   - ✅ Cancellation
   - ✅ Expiration
   - ✅ Billing Issue
   - ✅ Product Change

### Handle Webhook (Node.js/Express Example)

```javascript
app.post('/webhooks/revenuecat', express.json(), async (req, res) => {
    const event = req.body.event;
    
    console.log(`Received RevenueCat event: ${event.type}`);
    
    try {
        const userId = event.app_user_id;
        const productId = event.product_id;
        const expirationDate = event.expiration_at_ms 
            ? new Date(event.expiration_at_ms) 
            : null;
        
        // Update user's subscription status in your database
        await updateUserSubscription({
            userId: userId,
            productId: productId,
            status: getStatusFromEventType(event.type),
            expiresAt: expirationDate,
            eventType: event.type
        });
        
        // Handle specific event types
        switch (event.type) {
            case 'INITIAL_PURCHASE':
                // First time purchase
                await sendWelcomeEmail(userId);
                await trackAnalytics('subscription_started', userId);
                break;
                
            case 'RENEWAL':
                // Subscription renewed
                await trackAnalytics('subscription_renewed', userId);
                break;
                
            case 'CANCELLATION':
                // User cancelled (but subscription still active until expiration)
                await sendCancellationSurvey(userId);
                await trackAnalytics('subscription_cancelled', userId);
                break;
                
            case 'EXPIRATION':
                // Subscription expired
                await downgradeToFree(userId);
                await sendWinbackEmail(userId);
                await trackAnalytics('subscription_expired', userId);
                break;
                
            case 'BILLING_ISSUE':
                // Payment failed
                await sendBillingIssueNotification(userId);
                await trackAnalytics('billing_issue', userId);
                break;
                
            case 'PRODUCT_CHANGE':
                // User switched plans (monthly to annual, etc.)
                await trackAnalytics('subscription_changed', userId);
                break;
        }
        
        // Always respond with 200 OK to acknowledge receipt
        res.status(200).send('OK');
        
    } catch (error) {
        console.error('Error processing webhook:', error);
        // Still send 200 to prevent retries on permanent errors
        res.status(200).send('ERROR');
    }
});

function getStatusFromEventType(eventType) {
    switch (eventType) {
        case 'INITIAL_PURCHASE':
        case 'RENEWAL':
            return 'active';
        case 'CANCELLATION':
            return 'cancelled';
        case 'EXPIRATION':
            return 'expired';
        case 'BILLING_ISSUE':
            return 'active'; // Still active but at risk
        default:
            return 'active';
    }
}
```

---

## Paywall UI Best Practices

### Free vs Premium Comparison

```
FREE                          PREMIUM
─────────────────────────────────────────
✓ Block 3 apps                ✓ Block unlimited apps
✓ Basic verse library         ✓ Full verse library (500+)
✓ 30s reading time (fixed)    ✓ Custom reading time
✗ Ads between unlocks         ✓ No ads
✗ Basic scheduling            ✓ Advanced scheduling
✗ Custom prayers              ✓ Custom prayers & content
✗ Analytics                   ✓ Progress analytics
✗ Cloud sync                  ✓ Cloud sync across devices
```

### Pricing Strategy

**Recommended Pricing:**
- Monthly: $4.99/month
- Annual: $29.99/year (50% savings!)
  - Show: "Save $30 with annual plan"
  - Monthly equivalent: "$2.50/month"

**Psychology:**
- Make annual plan the "Best Value" (highlighted)
- Show monthly equivalent price for annual
- Add "Most Popular" badge to recommended tier
- Use social proof: "Join 10,000+ users"

### Paywall Triggers

Show paywall when user:
1. ✅ Tries to block 4th app (free limit: 3)
2. ✅ Tries to access custom prayers
3. ✅ Tries to view analytics
4. ✅ Tries to adjust reading time
5. ✅ After 3 unlock sessions (soft trigger)
6. ✅ On app launch (occasionally, every 7 days)

### Paywall Copy Examples

**Headline:**
- "Unlock Your Full Spiritual Journey"
- "Premium: More Apps, More Peace"
- "Upgrade to Transform Your Screen Time"

**Value Propositions:**
- "Block all your distracting apps, not just 3"
- "Customize your spiritual practice your way"
- "See your spiritual growth over time"
- "Support the app and remove ads"

**Call to Action:**
- "Start Free Trial" (if offering trial)
- "Go Premium"
- "Unlock Premium"
- "Subscribe Now"

---

## Subscription Lifecycle

### New User Journey

```
Day 0:  Install app → Onboarding → Start using free tier
Day 1:  Hit free limit (3 apps) → See paywall → Subscribe or dismiss
Day 3:  Another paywall (if didn't subscribe)
Day 7:  Weekly summary notification → Highlight premium features
Day 14: Another paywall (if still free)
Day 30: Show streak achievement → Offer upgrade
```

### Trial Period (Optional)

You can offer a 7-day free trial:

**iOS:**
- Configure in App Store Connect
- RevenueCat automatically handles trial logic

**Android:**
- Configure in Google Play Console
- RevenueCat automatically handles trial logic

**Best Practice:**
- Clearly show "7 days free, then $4.99/month"
- Send reminder before trial ends (Day 5-6)
- Make cancellation easy

### Cancellation Flow

When user wants to cancel:
1. **Ask why**: Show survey with options
   - Too expensive
   - Not using enough
   - Missing features
   - Technical issues
   - Other
2. **Offer alternatives**:
   - If "too expensive": Show annual plan (cheaper monthly)
   - If "not using enough": Offer pause subscription
   - If "missing features": Ask what they want
3. **Make it easy**: Direct link to subscription management
4. **Feedback**: Thank them, say they can come back anytime

---

## Testing Subscriptions

### iOS Sandbox Testing

1. Create sandbox tester accounts in App Store Connect
2. Sign out of real Apple ID on device
3. Sign in with sandbox account when prompted during purchase
4. Subscriptions auto-renew every few minutes (not real time)

### Android Testing

1. Add tester emails to Google Play Console
2. Testers can make real purchases that auto-cancel
3. Use test product IDs for faster testing

### RevenueCat Testing

- Use RevenueCat's "sandbox" mode
- Test webhook events using Dashboard's "Send Test Event"
- Check logs in RevenueCat Dashboard → Customer Lists

---

## Analytics & Metrics

### Key Metrics to Track

1. **Conversion Rate**: Free → Premium
   - Formula: (Premium Users / Total Users) × 100
   - Target: 2-5% for subscription apps

2. **Trial Conversion**: Trial → Paid
   - Formula: (Converted Trials / Total Trials) × 100
   - Target: 40-60%

3. **Monthly Recurring Revenue (MRR)**
   - Sum of all active monthly subscriptions
   - Normalize annual to monthly (÷12)

4. **Annual Recurring Revenue (ARR)**
   - MRR × 12

5. **Churn Rate**: Monthly cancellations
   - Formula: (Cancelled / Active at Start) × 100
   - Target: < 5% monthly

6. **Lifetime Value (LTV)**
   - Average revenue per user over their lifetime
   - Formula: ARPU ÷ Churn Rate

### RevenueCat Charts

RevenueCat Dashboard provides:
- Revenue charts (daily, weekly, monthly)
- Active subscriptions count
- Trial conversion rate
- Churn rate
- Country breakdown
- Product performance
- Cohort analysis

---

## Advanced Features

### Promotional Offers (iOS)

Offer discounts to specific users:
- 50% off for 3 months
- $0.99 for first month
- Free month for returned users

Configure in App Store Connect + RevenueCat

### Intro Pricing (Android)

Similar to promotional offers:
- Discounted first period
- Free trial + discounted price
- Configure in Google Play Console

### Subscription Groups (iOS)

Users can only have one subscription per group:
- Create "Prayer App Premium" group
- Add monthly, annual, lifetime to group
- User can upgrade/downgrade within group

### Grace Periods

If payment fails:
- iOS: Automatic 16-day grace period
- Android: Configurable up to 7 days
- RevenueCat tracks this automatically

### A/B Testing

Test different:
- Prices ($4.99 vs $3.99)
- Trials (3 days vs 7 days)
- Package combinations (monthly only vs monthly+annual)
- Paywall designs

RevenueCat supports A/B testing via Offerings

---

## Compliance & Legal

### Required Elements

1. **Privacy Policy**: Link in paywall
2. **Terms of Service**: Link in paywall
3. **Subscription Terms**: Must clearly show:
   - Price
   - Billing frequency
   - Auto-renewal notice
   - Cancellation policy
4. **Restore Purchases**: Always provide button

### Sample Subscription Terms

```
Subscription Terms:
- Premium subscription auto-renews monthly/annually
- Payment charged to Apple ID/Google Play account
- Subscription automatically renews unless cancelled 24 hours before period ends
- Account charged for renewal within 24 hours before period ends
- Manage subscription in Account Settings
- Cancel anytime in Account Settings
- No refunds for partial periods
```

### GDPR Compliance

If serving EU users:
- Allow users to export their data
- Allow users to delete their data
- Get consent before processing data
- RevenueCat is GDPR compliant

---

## Common Issues & Solutions

### Issue: "Restore Purchases" not working

**Solution:**
```swift
// Make sure user is logged in to same RevenueCat user ID
Purchases.shared.logIn(userId) { (customerInfo, created, error) in
    Purchases.shared.restorePurchases { (customerInfo, error) in
        // Now restore should work
    }
}
```

### Issue: Subscription not showing up after purchase

**Solution:**
- Check RevenueCat Dashboard → Customer Lists
- Verify product IDs match between App Store/Play Store and RevenueCat
- Check logs for errors
- May take a few seconds for Apple/Google to confirm

### Issue: User cancelled but still has access

**Solution:**
- This is expected! They have access until expiration date
- Check `customerInfo.entitlements["premium"]?.expirationDate`
- Show: "Premium until Dec 15, 2024"

### Issue: Webhook not receiving events

**Solution:**
- Verify webhook URL is correct and accessible
- Check RevenueCat Dashboard → Integrations → Webhooks for error logs
- Webhook must return 200 OK
- Test with "Send Test Event" in dashboard

---

## Next Steps

1. ✅ Create RevenueCat account
2. ✅ Configure App Store Connect / Google Play Console
3. ✅ Create products (premium_monthly, premium_annual)
4. ✅ Create "premium" entitlement in RevenueCat
5. ✅ Integrate SDK in mobile app
6. ✅ Design paywall UI
7. ✅ Test subscriptions with sandbox accounts
8. ✅ Set up webhook endpoint (optional but recommended)
9. ✅ Launch with free tier
10. ✅ Monitor metrics and optimize

---

## Resources

- [RevenueCat Documentation](https://www.revenuecat.com/docs/)
- [iOS SDK Reference](https://sdk.revenuecat.com/ios/)
- [Android SDK Reference](https://sdk.revenuecat.com/android/)
- [Webhook Documentation](https://www.revenuecat.com/docs/webhooks)
- [Sample Apps](https://github.com/RevenueCat/purchases-ios/tree/main/Examples)

