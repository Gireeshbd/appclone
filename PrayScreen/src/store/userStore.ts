/**
 * User state management with Zustand
 */

import {create} from 'zustand';
import {User, UserPreferences, UserStats} from '@types';

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  updateStats: (stats: Partial<UserStats>) => void;
  clearUser: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({user, error: null}),

  updatePreferences: (preferences) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            preferences: {...state.user.preferences, ...preferences},
          }
        : null,
    })),

  updateStats: (stats) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            stats: {...state.user.stats, ...stats},
          }
        : null,
    })),

  clearUser: () => set({user: null, error: null}),
  setLoading: (isLoading) => set({isLoading}),
  setError: (error) => set({error}),
}));
