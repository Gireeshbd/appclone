/**
 * Subscription state management with Zustand
 */

import {create} from 'zustand';
import {SubscriptionInfo, SubscriptionTier} from '@types';

interface SubscriptionState {
  subscriptionInfo: SubscriptionInfo | null;
  isLoading: boolean;
  error: string | null;

  // Computed values
  isPremium: () => boolean;
  canAccessFeature: (feature: string) => boolean;

  // Actions
  setSubscriptionInfo: (info: SubscriptionInfo) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  refreshSubscription: () => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  subscriptionInfo: null,
  isLoading: false,
  error: null,

  isPremium: () => {
    const info = get().subscriptionInfo;
    return info?.entitlements.premium.isActive ?? false;
  },

  canAccessFeature: (feature: string) => {
    const isPremium = get().isPremium();

    // Free tier features
    const freeFeatures = ['basic_verse_library', 'block_3_apps', 'daily_verse'];

    // Premium features
    const premiumFeatures = [
      'unlimited_apps',
      'full_verse_library',
      'custom_prayers',
      'advanced_scheduling',
      'analytics',
      'no_ads',
      'custom_reading_time',
      'cloud_sync',
    ];

    if (freeFeatures.includes(feature)) {
      return true;
    }

    if (premiumFeatures.includes(feature)) {
      return isPremium;
    }

    return false;
  },

  setSubscriptionInfo: (info) => set({subscriptionInfo: info, error: null}),
  setLoading: (isLoading) => set({isLoading}),
  setError: (error) => set({error}),

  refreshSubscription: async () => {
    set({isLoading: true});
    try {
      // TODO: Implement RevenueCat refresh
      // const customerInfo = await Purchases.getCustomerInfo();
      // Update subscription info based on customerInfo
      set({isLoading: false});
    } catch (error) {
      set({error: (error as Error).message, isLoading: false});
    }
  },
}));
