/**
 * Main type definitions export
 */

export * from './user';
export * from './app';
export * from './verse';
export * from './session';
export * from './subscription';

// Navigation types
export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  PrayerSession: {
    verseId?: string;
    triggeredByApps: string[];
  };
  Paywall: {
    source: string;
  };
  Settings: undefined;
  AppSelection: undefined;
  VerseDetail: {
    verseId: string;
  };
};

export type MainTabParamList = {
  Home: undefined;
  Progress: undefined;
  Library: undefined;
  Settings: undefined;
};
