/**
 * Blocked apps state management with Zustand
 */

import {create} from 'zustand';
import {BlockedApp, InstalledApp} from '@types';

interface AppState {
  blockedApps: BlockedApp[];
  installedApps: InstalledApp[];
  isBlocking: boolean;
  currentlyUnlockedApps: string[]; // Bundle IDs
  unlockExpiresAt: Date | null;

  // Actions
  setBlockedApps: (apps: BlockedApp[]) => void;
  addBlockedApp: (app: BlockedApp) => void;
  removeBlockedApp: (appId: string) => void;
  updateBlockedApp: (appId: string, updates: Partial<BlockedApp>) => void;
  setInstalledApps: (apps: InstalledApp[]) => void;
  setBlocking: (isBlocking: boolean) => void;
  unlockApps: (bundleIds: string[], duration: number) => void;
  lockApps: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  blockedApps: [],
  installedApps: [],
  isBlocking: true,
  currentlyUnlockedApps: [],
  unlockExpiresAt: null,

  setBlockedApps: (apps) => set({blockedApps: apps}),

  addBlockedApp: (app) =>
    set((state) => ({
      blockedApps: [...state.blockedApps, app],
    })),

  removeBlockedApp: (appId) =>
    set((state) => ({
      blockedApps: state.blockedApps.filter((app) => app.id !== appId),
    })),

  updateBlockedApp: (appId, updates) =>
    set((state) => ({
      blockedApps: state.blockedApps.map((app) =>
        app.id === appId ? {...app, ...updates} : app,
      ),
    })),

  setInstalledApps: (apps) => set({installedApps: apps}),

  setBlocking: (isBlocking) => set({isBlocking}),

  unlockApps: (bundleIds, duration) => {
    const expiresAt = new Date(Date.now() + duration * 1000);
    set({
      currentlyUnlockedApps: bundleIds,
      unlockExpiresAt: expiresAt,
    });

    // Auto-lock after duration
    setTimeout(() => {
      set({currentlyUnlockedApps: [], unlockExpiresAt: null});
    }, duration * 1000);
  },

  lockApps: () =>
    set({
      currentlyUnlockedApps: [],
      unlockExpiresAt: null,
    }),
}));
