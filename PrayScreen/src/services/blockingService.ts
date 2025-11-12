/**
 * App Blocking Service
 * Native module interface for iOS Screen Time API and Android Accessibility Service
 *
 * @module services/blockingService
 */

import {NativeModules, Platform} from 'react-native';
import {BlockedApp, InstalledApp} from '@types';

// Native module interfaces
interface AppBlockingModule {
  // iOS Screen Time API / Android Accessibility Service
  requestPermission(): Promise<boolean>;
  hasPermission(): Promise<boolean>;
  getInstalledApps(): Promise<InstalledApp[]>;
  blockApps(bundleIds: string[]): Promise<boolean>;
  unblockApps(bundleIds: string[], duration: number): Promise<boolean>;
  isAppBlocked(bundleId: string): Promise<boolean>;
  openAppSettings(): Promise<void>;
}

// Get native module
const {AppBlockingModule: NativeAppBlocking} = NativeModules;

/**
 * App Blocking Service Class
 * Provides cross-platform interface to native app blocking functionality
 */
class BlockingService {
  /**
   * Request permission for app blocking
   * iOS: Screen Time API permission
   * Android: Accessibility Service permission
   */
  async requestPermission(): Promise<boolean> {
    try {
      if (!NativeAppBlocking) {
        console.warn('Native blocking module not available');
        return false;
      }
      return await NativeAppBlocking.requestPermission();
    } catch (error) {
      console.error('Error requesting blocking permission:', error);
      return false;
    }
  }

  /**
   * Check if app has blocking permission
   */
  async hasPermission(): Promise<boolean> {
    try {
      if (!NativeAppBlocking) {
        console.warn('Native blocking module not available');
        return false;
      }
      return await NativeAppBlocking.hasPermission();
    } catch (error) {
      console.error('Error checking blocking permission:', error);
      return false;
    }
  }

  /**
   * Get list of installed apps on device
   */
  async getInstalledApps(): Promise<InstalledApp[]> {
    try {
      if (!NativeAppBlocking) {
        console.warn('Native blocking module not available, returning mock data');
        return this.getMockInstalledApps();
      }
      return await NativeAppBlocking.getInstalledApps();
    } catch (error) {
      console.error('Error getting installed apps:', error);
      return this.getMockInstalledApps();
    }
  }

  /**
   * Block specific apps
   */
  async blockApps(bundleIds: string[]): Promise<boolean> {
    try {
      if (!NativeAppBlocking) {
        console.warn('Native blocking module not available');
        return false;
      }
      return await NativeAppBlocking.blockApps(bundleIds);
    } catch (error) {
      console.error('Error blocking apps:', error);
      return false;
    }
  }

  /**
   * Temporarily unblock apps for a specific duration
   */
  async unblockApps(bundleIds: string[], durationSeconds: number): Promise<boolean> {
    try {
      if (!NativeAppBlocking) {
        console.warn('Native blocking module not available');
        return false;
      }
      return await NativeAppBlocking.unblockApps(bundleIds, durationSeconds);
    } catch (error) {
      console.error('Error unblocking apps:', error);
      return false;
    }
  }

  /**
   * Check if specific app is currently blocked
   */
  async isAppBlocked(bundleId: string): Promise<boolean> {
    try {
      if (!NativeAppBlocking) {
        return false;
      }
      return await NativeAppBlocking.isAppBlocked(bundleId);
    } catch (error) {
      console.error('Error checking if app is blocked:', error);
      return false;
    }
  }

  /**
   * Open system settings for app blocking permissions
   */
  async openAppSettings(): Promise<void> {
    try {
      if (!NativeAppBlocking) {
        console.warn('Native blocking module not available');
        return;
      }
      await NativeAppBlocking.openAppSettings();
    } catch (error) {
      console.error('Error opening app settings:', error);
    }
  }

  /**
   * Mock installed apps for development/testing
   */
  private getMockInstalledApps(): InstalledApp[] {
    const commonApps = [
      {
        bundleId: Platform.OS === 'ios' ? 'com.facebook.Facebook' : 'com.facebook.katana',
        appName: 'Facebook',
        appIcon: '',
      },
      {
        bundleId:
          Platform.OS === 'ios' ? 'com.burbn.instagram' : 'com.instagram.android',
        appName: 'Instagram',
        appIcon: '',
      },
      {
        bundleId: Platform.OS === 'ios' ? 'com.atebits.Tweetie2' : 'com.twitter.android',
        appName: 'X (Twitter)',
        appIcon: '',
      },
      {
        bundleId: Platform.OS === 'ios' ? 'com.zhiliaoapp.musically' : 'com.zhiliaoapp.musically',
        appName: 'TikTok',
        appIcon: '',
      },
      {
        bundleId: Platform.OS === 'ios' ? 'com.reddit.Reddit' : 'com.reddit.frontpage',
        appName: 'Reddit',
        appIcon: '',
      },
      {
        bundleId: Platform.OS === 'ios' ? 'com.google.ios.youtube' : 'com.google.android.youtube',
        appName: 'YouTube',
        appIcon: '',
      },
      {
        bundleId: Platform.OS === 'ios' ? 'com.snapchat.snapchat' : 'com.snapchat.android',
        appName: 'Snapchat',
        appIcon: '',
      },
    ];

    return commonApps;
  }

  /**
   * Get permission instructions based on platform
   */
  getPermissionInstructions(): {title: string; steps: string[]} {
    if (Platform.OS === 'ios') {
      return {
        title: 'Enable Screen Time',
        steps: [
          'Open Settings app',
          'Go to Screen Time',
          'Tap "Turn On Screen Time"',
          'Select "This is My Device"',
          'Return to PrayScreen and grant permission',
        ],
      };
    } else {
      return {
        title: 'Enable Accessibility Service',
        steps: [
          'Open Settings app',
          'Go to Accessibility',
          'Find "PrayScreen" in the list',
          'Toggle the switch to enable',
          'Confirm the permission dialog',
        ],
      };
    }
  }
}

// Export singleton instance
export const blockingService = new BlockingService();
