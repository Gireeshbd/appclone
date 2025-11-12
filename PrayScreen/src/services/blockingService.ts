/**
 * App Blocking Service
 * Native module interface for iOS Screen Time API and Android Accessibility Service
 *
 * @module services/blockingService
 */

import {NativeModules, NativeEventEmitter, Platform, EmitterSubscription} from 'react-native';
import {BlockedApp, InstalledApp} from '@types';

// Native module interfaces for iOS
interface IOSScreenTimeManager {
  requestAuthorization(): Promise<{authorized: boolean}>;
  checkAuthorizationStatus(): Promise<{status: string; authorized: boolean}>;
  blockApps(bundleIds: string[]): Promise<{success: boolean; blockedCount: number}>;
  unblockApps(bundleIds: string[]): Promise<{success: boolean; unblockedCount: number}>;
  unblockAllApps(): Promise<{success: boolean}>;
  openAppPicker(): Promise<void>;
  getInstalledApps(): Promise<Array<{bundleId: string; name: string; icon: string}>>;
}

// Native module interfaces for Android
interface AndroidBlockingModule {
  checkPermissionStatus(): Promise<{
    hasPermission: boolean;
    isServiceRunning: boolean;
    status: string;
  }>;
  requestPermission(): Promise<{opened: boolean; message: string}>;
  blockApps(bundleIds: string[]): Promise<{success: boolean; blockedCount: number}>;
  unblockApps(bundleIds: string[], durationSeconds: number): Promise<{
    success: boolean;
    unblockedCount: number;
    duration: number;
  }>;
  getBlockedApps(): Promise<string[]>;
  lockAllApps(): Promise<{success: boolean}>;
  getInstalledApps(): Promise<Array<{bundleId: string; name: string; icon: string}>>;
}

// Get native modules
const ScreenTimeManager = Platform.OS === 'ios'
  ? (NativeModules.ScreenTimeManager as IOSScreenTimeManager)
  : null;

const BlockingModule = Platform.OS === 'android'
  ? (NativeModules.BlockingModule as AndroidBlockingModule)
  : null;

/**
 * App Blocking Service Class
 * Provides cross-platform interface to native app blocking functionality
 */
class BlockingService {
  private eventEmitter: NativeEventEmitter | null = null;
  private appBlockedSubscription: EmitterSubscription | null = null;

  constructor() {
    if (Platform.OS === 'android' && BlockingModule) {
      this.eventEmitter = new NativeEventEmitter(BlockingModule as any);
      this.setupEventListeners();
    }
  }

  /**
   * Setup event listeners for native events
   */
  private setupEventListeners() {
    if (this.eventEmitter) {
      this.appBlockedSubscription = this.eventEmitter.addListener(
        'onAppBlocked',
        (event: {packageName: string; timestamp: number}) => {
          console.log('App blocked event:', event);
          // This event can be used to trigger prayer screen
        }
      );
    }
  }

  /**
   * Cleanup event listeners
   */
  cleanup() {
    if (this.appBlockedSubscription) {
      this.appBlockedSubscription.remove();
    }
  }

  /**
   * Request permission for app blocking
   * iOS: Screen Time API authorization
   * Android: Accessibility Service permission
   */
  async requestPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        if (!ScreenTimeManager) {
          console.warn('iOS Screen Time Manager not available');
          return false;
        }

        const result = await ScreenTimeManager.requestAuthorization();
        return result.authorized;
      } else {
        if (!BlockingModule) {
          console.warn('Android Blocking Module not available');
          return false;
        }

        const result = await BlockingModule.requestPermission();
        // Android opens settings, doesn't return authorization status directly
        return result.opened;
      }
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
      if (Platform.OS === 'ios') {
        if (!ScreenTimeManager) {
          return false;
        }

        const result = await ScreenTimeManager.checkAuthorizationStatus();
        return result.authorized;
      } else {
        if (!BlockingModule) {
          return false;
        }

        const result = await BlockingModule.checkPermissionStatus();
        return result.hasPermission && result.isServiceRunning;
      }
    } catch (error) {
      console.error('Error checking blocking permission:', error);
      return false;
    }
  }

  /**
   * Get detailed permission status
   */
  async getPermissionStatus(): Promise<{
    hasPermission: boolean;
    status: string;
    message: string;
  }> {
    try {
      if (Platform.OS === 'ios') {
        if (!ScreenTimeManager) {
          return {
            hasPermission: false,
            status: 'unavailable',
            message: 'Screen Time API not available',
          };
        }

        const result = await ScreenTimeManager.checkAuthorizationStatus();
        return {
          hasPermission: result.authorized,
          status: result.status,
          message: this.getIOSStatusMessage(result.status),
        };
      } else {
        if (!BlockingModule) {
          return {
            hasPermission: false,
            status: 'unavailable',
            message: 'Blocking module not available',
          };
        }

        const result = await BlockingModule.checkPermissionStatus();
        return {
          hasPermission: result.hasPermission && result.isServiceRunning,
          status: result.status,
          message: this.getAndroidStatusMessage(result.status, result.isServiceRunning),
        };
      }
    } catch (error) {
      console.error('Error getting permission status:', error);
      return {
        hasPermission: false,
        status: 'error',
        message: 'Failed to check permission status',
      };
    }
  }

  private getIOSStatusMessage(status: string): string {
    switch (status) {
      case 'notDetermined':
        return 'Permission not requested yet';
      case 'denied':
        return 'Screen Time permission denied';
      case 'approved':
        return 'Screen Time authorized';
      default:
        return 'Unknown status';
    }
  }

  private getAndroidStatusMessage(status: string, isRunning: boolean): string {
    if (status === 'granted' && isRunning) {
      return 'Accessibility service enabled and running';
    } else if (status === 'granted' && !isRunning) {
      return 'Accessibility enabled but service not running';
    } else {
      return 'Accessibility service not enabled';
    }
  }

  /**
   * Get list of installed apps on device
   */
  async getInstalledApps(): Promise<InstalledApp[]> {
    try {
      const nativeModule = Platform.OS === 'ios' ? ScreenTimeManager : BlockingModule;

      if (!nativeModule) {
        console.warn('Native blocking module not available, returning mock data');
        return this.getMockInstalledApps();
      }

      const apps = await nativeModule.getInstalledApps();
      return apps.map(app => ({
        bundleId: app.bundleId,
        appName: app.name,
        appIcon: app.icon,
      }));
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
      const nativeModule = Platform.OS === 'ios' ? ScreenTimeManager : BlockingModule;

      if (!nativeModule) {
        console.warn('Native blocking module not available');
        return false;
      }

      const result = await nativeModule.blockApps(bundleIds);
      return result.success;
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
      if (Platform.OS === 'ios') {
        if (!ScreenTimeManager) {
          console.warn('iOS Screen Time Manager not available');
          return false;
        }

        // iOS: Just unblock, timer handled in JS layer
        const result = await ScreenTimeManager.unblockApps(bundleIds);
        return result.success;
      } else {
        if (!BlockingModule) {
          console.warn('Android Blocking Module not available');
          return false;
        }

        // Android: Native module handles timer
        const result = await BlockingModule.unblockApps(bundleIds, durationSeconds);
        return result.success;
      }
    } catch (error) {
      console.error('Error unblocking apps:', error);
      return false;
    }
  }

  /**
   * Lock all apps (re-enable blocking)
   */
  async lockAllApps(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        if (!ScreenTimeManager) {
          return false;
        }

        const result = await ScreenTimeManager.unblockAllApps();
        return result.success;
      } else {
        if (!BlockingModule) {
          return false;
        }

        const result = await BlockingModule.lockAllApps();
        return result.success;
      }
    } catch (error) {
      console.error('Error locking all apps:', error);
      return false;
    }
  }

  /**
   * Check if specific app is currently blocked
   */
  async isAppBlocked(bundleId: string): Promise<boolean> {
    try {
      if (Platform.OS === 'android' && BlockingModule) {
        const blockedApps = await BlockingModule.getBlockedApps();
        return blockedApps.includes(bundleId);
      }

      // iOS: Would need to track this in app state
      return false;
    } catch (error) {
      console.error('Error checking if app is blocked:', error);
      return false;
    }
  }

  /**
   * Open app picker (iOS only)
   */
  async openAppPicker(): Promise<void> {
    if (Platform.OS === 'ios' && ScreenTimeManager) {
      try {
        await ScreenTimeManager.openAppPicker();
      } catch (error) {
        console.error('Error opening app picker:', error);
        throw error;
      }
    } else {
      throw new Error('App picker only available on iOS');
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
        bundleId: Platform.OS === 'ios' ? 'com.burbn.instagram' : 'com.instagram.android',
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
          'Tap "Request Permission" below',
          'Review the Screen Time permission dialog',
          'Tap "Allow" to grant access',
          'PrayScreen will then be able to block apps',
          'Note: Screen Time requires iOS 15.0 or later',
        ],
      };
    } else {
      return {
        title: 'Enable Accessibility Service',
        steps: [
          'Tap "Open Settings" below',
          'Find and tap "PrayScreen" in the list',
          'Toggle the switch to ON',
          'Confirm the permission dialog',
          'Return to PrayScreen',
        ],
      };
    }
  }

  /**
   * Check if native modules are available
   */
  isAvailable(): boolean {
    return Platform.OS === 'ios' ? ScreenTimeManager !== null : BlockingModule !== null;
  }
}

// Export singleton instance
export const blockingService = new BlockingService();
