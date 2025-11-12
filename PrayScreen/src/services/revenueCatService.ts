/**
 * RevenueCat Service
 * Handles subscription management via RevenueCat
 *
 * @module services/revenueCatService
 */

import {Platform} from 'react-native';
// Note: This will work once react-native-purchases is properly installed
// import Purchases, {CustomerInfo, PurchasesOffering} from 'react-native-purchases';

const REVENUECAT_API_KEY = Platform.select({
  ios: 'YOUR_IOS_API_KEY', // TODO: Replace with actual key
  android: 'YOUR_ANDROID_API_KEY', // TODO: Replace with actual key
});

export const PRODUCT_IDS = {
  WEEKLY: 'premium_weekly', // $4.99/week
  ANNUAL: 'premium_annual', // $39.99/year
} as const;

export const ENTITLEMENT_ID = 'premium';

/**
 * RevenueCat Service Class
 * Manages subscriptions, purchases, and entitlements
 */
class RevenueCatService {
  private isInitialized = false;

  /**
   * Initialize RevenueCat SDK
   */
  async initialize(userId: string): Promise<void> {
    if (this.isInitialized) {
      console.log('RevenueCat already initialized');
      return;
    }

    try {
      // TODO: Uncomment when RevenueCat is installed
      /*
      await Purchases.configure({
        apiKey: REVENUECAT_API_KEY!,
        appUserID: userId,
      });
      */

      this.isInitialized = true;
      console.log('RevenueCat initialized successfully');
    } catch (error) {
      console.error('Error initializing RevenueCat:', error);
      throw error;
    }
  }

  /**
   * Get customer info (subscription status)
   */
  async getCustomerInfo(): Promise<any> {
    try {
      // TODO: Uncomment when RevenueCat is installed
      // const customerInfo = await Purchases.getCustomerInfo();
      // return customerInfo;

      // Mock response for development
      return {
        entitlements: {
          active: {},
        },
      };
    } catch (error) {
      console.error('Error getting customer info:', error);
      throw error;
    }
  }

  /**
   * Check if user has premium subscription
   */
  async hasPremium(): Promise<boolean> {
    try {
      const customerInfo = await this.getCustomerInfo();
      return !!customerInfo.entitlements?.active?.[ENTITLEMENT_ID];
    } catch (error) {
      console.error('Error checking premium status:', error);
      return false;
    }
  }

  /**
   * Get available offerings
   */
  async getOfferings(): Promise<any> {
    try {
      // TODO: Uncomment when RevenueCat is installed
      // const offerings = await Purchases.getOfferings();
      // return offerings.current;

      // Mock response for development
      return {
        availablePackages: [
          {
            identifier: 'weekly',
            packageType: 'WEEKLY',
            product: {
              identifier: PRODUCT_IDS.WEEKLY,
              priceString: '$4.99',
              price: 4.99,
              currencyCode: 'USD',
              subscriptionPeriod: 'P1W',
            },
          },
          {
            identifier: 'annual',
            packageType: 'ANNUAL',
            product: {
              identifier: PRODUCT_IDS.ANNUAL,
              priceString: '$39.99',
              price: 39.99,
              currencyCode: 'USD',
              subscriptionPeriod: 'P1Y',
            },
          },
        ],
      };
    } catch (error) {
      console.error('Error getting offerings:', error);
      throw error;
    }
  }

  /**
   * Purchase a package
   */
  async purchasePackage(packageToPurchase: any): Promise<{
    customerInfo: any;
    productIdentifier: string;
  }> {
    try {
      // TODO: Uncomment when RevenueCat is installed
      /*
      const {customerInfo, productIdentifier} = await Purchases.purchasePackage(
        packageToPurchase,
      );
      return {customerInfo, productIdentifier};
      */

      // Mock response for development
      console.log('Mock purchase:', packageToPurchase);
      return {
        customerInfo: {
          entitlements: {
            active: {
              [ENTITLEMENT_ID]: {
                isActive: true,
              },
            },
          },
        },
        productIdentifier: packageToPurchase.product?.identifier || '',
      };
    } catch (error) {
      console.error('Error purchasing package:', error);
      throw error;
    }
  }

  /**
   * Restore purchases
   */
  async restorePurchases(): Promise<any> {
    try {
      // TODO: Uncomment when RevenueCat is installed
      // const customerInfo = await Purchases.restorePurchases();
      // return customerInfo;

      // Mock response for development
      return {
        entitlements: {
          active: {},
        },
      };
    } catch (error) {
      console.error('Error restoring purchases:', error);
      throw error;
    }
  }

  /**
   * Get subscription expiration date
   */
  async getExpirationDate(): Promise<Date | null> {
    try {
      const customerInfo = await this.getCustomerInfo();
      const premiumEntitlement = customerInfo.entitlements?.active?.[ENTITLEMENT_ID];

      if (premiumEntitlement?.expirationDate) {
        return new Date(premiumEntitlement.expirationDate);
      }

      return null;
    } catch (error) {
      console.error('Error getting expiration date:', error);
      return null;
    }
  }

  /**
   * Check if subscription will renew
   */
  async willRenew(): Promise<boolean> {
    try {
      const customerInfo = await this.getCustomerInfo();
      const premiumEntitlement = customerInfo.entitlements?.active?.[ENTITLEMENT_ID];
      return premiumEntitlement?.willRenew ?? false;
    } catch (error) {
      console.error('Error checking renewal status:', error);
      return false;
    }
  }

  /**
   * Set user attributes for analytics
   */
  async setUserAttributes(attributes: Record<string, string | number>): Promise<void> {
    try {
      // TODO: Uncomment when RevenueCat is installed
      /*
      for (const [key, value] of Object.entries(attributes)) {
        await Purchases.setAttributes({[key]: String(value)});
      }
      */
      console.log('Set user attributes:', attributes);
    } catch (error) {
      console.error('Error setting user attributes:', error);
    }
  }
}

// Export singleton instance
export const revenueCatService = new RevenueCatService();
