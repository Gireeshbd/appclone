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
  unlockTimerId: NodeJS.Timeout | null;

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

export const useAppStore = create<AppState>((set, get) => ({
  blockedApps: [],
  installedApps: [],
  isBlocking: true,
  currentlyUnlockedApps: [],
  unlockExpiresAt: null,
  unlockTimerId: null,

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
    // Clear existing timer if any
    const state = get();
    if (state.unlockTimerId) {
      clearTimeout(state.unlockTimerId);
    }

    const expiresAt = new Date(Date.now() + duration * 1000);

    // Auto-lock after duration
    const timerId = setTimeout(() => {
      set({currentlyUnlockedApps: [], unlockExpiresAt: null, unlockTimerId: null});
    }, duration * 1000);

    set({
      currentlyUnlockedApps: bundleIds,
      unlockExpiresAt: expiresAt,
      unlockTimerId: timerId,
    });
  },

  lockApps: () => {
    const state = get();
    if (state.unlockTimerId) {
      clearTimeout(state.unlockTimerId);
    }
    set({
      currentlyUnlockedApps: [],
      unlockExpiresAt: null,
      unlockTimerId: null,
    });
  },
}));
