/**
 * Custom hook for verse management
 */

import {useState, useEffect, useCallback} from 'react';
import {VerseContent} from '@types';
import {verseService} from '@services';
import {useUserStore, useSubscriptionStore} from '@store';

export const useVerse = () => {
  const {user} = useUserStore();
  const {isPremium} = useSubscriptionStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRandomVerse = useCallback(async (): Promise<VerseContent | null> => {
    setLoading(true);
    setError(null);

    try {
      const categories = user?.preferences.verseCategories || [];
      const verse = verseService.getRandomVerse(categories, [], isPremium());

      if (verse) {
        verseService.recordVerseShown(verse.id);
      }

      setLoading(false);
      return verse;
    } catch (err) {
      setError('Failed to load verse');
      setLoading(false);
      return null;
    }
  }, [user, isPremium]);

  const getDailyVerse = useCallback((): VerseContent => {
    return verseService.getDailyVerse();
  }, []);

  const getVerseById = useCallback((id: string): VerseContent | null => {
    return verseService.getVerseById(id);
  }, []);

  const recordReadingTime = useCallback((verseId: string, duration: number) => {
    verseService.recordReadingTime(verseId, duration);
  }, []);

  return {
    loading,
    error,
    getRandomVerse,
    getDailyVerse,
    getVerseById,
    recordReadingTime,
  };
};
