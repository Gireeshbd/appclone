/**
 * Subscription and RevenueCat type definitions
 * Based on DATA_STRUCTURES.md and REVENUECAT_INTEGRATION.md
 */

export type PeriodType = 'trial' | 'weekly' | 'annual';
export type Store = 'app_store' | 'play_store';

export interface EntitlementInfo {
  isActive: boolean;
  willRenew: boolean;
  periodType: PeriodType;
  expirationDate?: Date;
  unsubscribeDetectedAt?: Date;
  billingIssueDetectedAt?: Date;
}

export interface ActiveSubscription {
  productId: string; // e.g., "premium_weekly" or "premium_annual"
  purchaseDate: Date;
  expirationDate?: Date;
  isInTrialPeriod: boolean;
  store: Store;
  isSandbox: boolean;
}

export interface Purchase {
  productId: string;
  purchaseDate: Date;
  revenueCatId: string;
  price: number;
  currency: string;
  store: Store;
}

export interface SubscriptionInfo {
  userId: string;
  revenueCatUserId: string;

  // Entitlements
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

// Product IDs
export const PRODUCT_IDS = {
  PREMIUM_WEEKLY: 'premium_weekly', // $4.99/week
  PREMIUM_ANNUAL: 'premium_annual', // $39.99/year
} as const;

export const ENTITLEMENT_ID = 'premium';
