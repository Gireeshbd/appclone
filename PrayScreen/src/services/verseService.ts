/**
 * Verse Library Service
 * Manages Bible verses and prayer content
 *
 * @module services/verseService
 */

import {VerseContent, VerseCategory} from '@types';

/**
 * Initial seed verses for the app
 * Production: This would come from a database/API
 */
export const SEED_VERSES: VerseContent[] = [
  {
    id: 'verse_001',
    type: 'verse',
    text: 'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.',
    reference: 'John 3:16',
    translation: 'ESV',
    categories: ['love', 'faith', 'hope'],
    tags: ['popular', 'gospel', 'salvation'],
    isPremium: false,
    length: 124,
    readingTimeEstimate: 35,
    timesShown: 0,
    averageReadingTime: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'verse_002',
    type: 'verse',
    text: 'I can do all things through him who strengthens me.',
    reference: 'Philippians 4:13',
    translation: 'ESV',
    categories: ['strength', 'courage', 'faith'],
    tags: ['popular', 'encouragement'],
    isPremium: false,
    length: 52,
    readingTimeEstimate: 25,
    timesShown: 0,
    averageReadingTime: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'verse_003',
    type: 'verse',
    text: 'The Lord is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul.',
    reference: 'Psalm 23:1-3',
    translation: 'ESV',
    categories: ['peace', 'comfort', 'guidance'],
    tags: ['popular', 'psalm'],
    isPremium: false,
    length: 140,
    readingTimeEstimate: 40,
    timesShown: 0,
    averageReadingTime: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'verse_004',
    type: 'verse',
    text: 'Trust in the Lord with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths.',
    reference: 'Proverbs 3:5-6',
    translation: 'ESV',
    categories: ['wisdom', 'guidance', 'faith'],
    tags: ['trust', 'direction'],
    isPremium: false,
    length: 155,
    readingTimeEstimate: 42,
    timesShown: 0,
    averageReadingTime: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'verse_005',
    type: 'verse',
    text: 'Be strong and courageous. Do not be frightened, and do not be dismayed, for the Lord your God is with you wherever you go.',
    reference: 'Joshua 1:9',
    translation: 'ESV',
    categories: ['courage', 'strength', 'protection'],
    tags: ['fear', 'encouragement'],
    isPremium: false,
    length: 123,
    readingTimeEstimate: 35,
    timesShown: 0,
    averageReadingTime: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'verse_006',
    type: 'verse',
    text: 'And we know that for those who love God all things work together for good, for those who are called according to his purpose.',
    reference: 'Romans 8:28',
    translation: 'ESV',
    categories: ['hope', 'faith', 'comfort'],
    tags: ['purpose', 'providence'],
    isPremium: false,
    length: 125,
    readingTimeEstimate: 36,
    timesShown: 0,
    averageReadingTime: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'verse_007',
    type: 'verse',
    text: 'Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God.',
    reference: 'Philippians 4:6',
    translation: 'ESV',
    categories: ['peace', 'prayer', 'gratitude'],
    tags: ['anxiety', 'worry'],
    isPremium: false,
    length: 140,
    readingTimeEstimate: 38,
    timesShown: 0,
    averageReadingTime: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'verse_008',
    type: 'verse',
    text: 'Love is patient and kind; love does not envy or boast; it is not arrogant or rude. It does not insist on its own way; it is not irritable or resentful.',
    reference: '1 Corinthians 13:4-5',
    translation: 'ESV',
    categories: ['love', 'patience', 'wisdom'],
    tags: ['relationships', 'character'],
    isPremium: false,
    length: 156,
    readingTimeEstimate: 42,
    timesShown: 0,
    averageReadingTime: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'prayer_001',
    type: 'prayer',
    text: 'Lord, grant me the serenity to accept the things I cannot change, the courage to change the things I can, and the wisdom to know the difference. Living one day at a time, enjoying one moment at a time.',
    title: 'Serenity Prayer',
    author: 'Reinhold Niebuhr',
    categories: ['peace', 'wisdom', 'acceptance'],
    tags: ['serenity', 'classic'],
    isPremium: false,
    length: 215,
    readingTimeEstimate: 50,
    timesShown: 0,
    averageReadingTime: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'prayer_002',
    type: 'prayer',
    text: 'Heavenly Father, help me to be present in this moment. Remove the distractions from my mind and heart. Guide me to focus on what truly matters. Give me strength to resist temptation and wisdom to use my time well. In Jesus name, Amen.',
    title: 'Prayer for Focus',
    categories: ['focus', 'guidance', 'temptation'],
    tags: ['distraction', 'mindfulness'],
    isPremium: false,
    length: 235,
    readingTimeEstimate: 52,
    timesShown: 0,
    averageReadingTime: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/**
 * Verse Service Class
 * Handles verse retrieval, filtering, and management
 */
class VerseService {
  private verses: VerseContent[] = SEED_VERSES;

  /**
   * Get all verses (filtered by premium status if needed)
   */
  getAllVerses(isPremium: boolean = false): VerseContent[] {
    if (isPremium) {
      return this.verses;
    }
    return this.verses.filter(v => !v.isPremium);
  }

  /**
   * Get a random verse based on user preferences
   */
  getRandomVerse(
    categories?: string[],
    excludeIds?: string[],
    isPremium: boolean = false,
  ): VerseContent | null {
    let availableVerses = this.getAllVerses(isPremium);

    // Filter by categories if provided
    if (categories && categories.length > 0) {
      availableVerses = availableVerses.filter(v =>
        v.categories.some(cat => categories.includes(cat)),
      );
    }

    // Exclude already shown verses
    if (excludeIds && excludeIds.length > 0) {
      availableVerses = availableVerses.filter(v => !excludeIds.includes(v.id));
    }

    if (availableVerses.length === 0) {
      // Fall back to all verses if filtering leaves none
      availableVerses = this.getAllVerses(isPremium);
    }

    // Select random verse
    const randomIndex = Math.floor(Math.random() * availableVerses.length);
    return availableVerses[randomIndex];
  }

  /**
   * Get verse by ID
   */
  getVerseById(id: string): VerseContent | null {
    return this.verses.find(v => v.id === id) || null;
  }

  /**
   * Get verses by category
   */
  getVersesByCategory(category: string, isPremium: boolean = false): VerseContent[] {
    return this.getAllVerses(isPremium).filter(v => v.categories.includes(category));
  }

  /**
   * Get daily verse (for now, just a random verse)
   * TODO: Implement actual daily verse rotation
   */
  getDailyVerse(): VerseContent {
    const today = new Date().toDateString();
    const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = seed % this.verses.filter(v => !v.isPremium).length;
    return this.verses.filter(v => !v.isPremium)[index];
  }

  /**
   * Track verse being shown
   */
  recordVerseShown(verseId: string): void {
    const verse = this.verses.find(v => v.id === verseId);
    if (verse) {
      verse.timesShown += 1;
    }
  }

  /**
   * Record actual reading time for a verse
   */
  recordReadingTime(verseId: string, duration: number): void {
    const verse = this.verses.find(v => v.id === verseId);
    if (verse) {
      // Calculate new average (timesShown already includes current instance)
      const totalTime = verse.averageReadingTime * verse.timesShown;
      verse.averageReadingTime = (totalTime + duration) / verse.timesShown;
    }
  }

  /**
   * Add a custom verse (Premium feature)
   */
  addCustomVerse(verse: Omit<VerseContent, 'id' | 'createdAt' | 'updatedAt'>): VerseContent {
    const newVerse: VerseContent = {
      ...verse,
      id: `custom_${Date.now()}`,
      type: 'custom',
      isPremium: true,
      timesShown: 0,
      averageReadingTime: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.verses.push(newVerse);
    return newVerse;
  }

  /**
   * Get available categories
   */
  getCategories(): VerseCategory[] {
    return [
      'strength',
      'peace',
      'gratitude',
      'wisdom',
      'love',
      'faith',
      'hope',
      'forgiveness',
      'temptation',
      'courage',
      'patience',
      'joy',
      'guidance',
      'protection',
      'comfort',
    ];
  }
}

// Export singleton instance
export const verseService = new VerseService();
