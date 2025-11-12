/**
 * Verse and prayer content type definitions
 * Based on DATA_STRUCTURES.md
 */

export type VerseType = 'verse' | 'prayer' | 'custom';

export type VerseCategory =
  | 'strength'
  | 'peace'
  | 'gratitude'
  | 'wisdom'
  | 'love'
  | 'faith'
  | 'hope'
  | 'forgiveness'
  | 'temptation'
  | 'courage'
  | 'patience'
  | 'joy'
  | 'guidance'
  | 'protection'
  | 'comfort';

export interface VerseContent {
  id: string;
  type: VerseType;

  // Content
  text: string;
  reference?: string; // e.g., "John 3:16"
  translation?: string; // e.g., "ESV", "NIV"

  // Categorization
  categories: string[];
  tags: string[];

  // Display
  title?: string; // For prayers
  author?: string; // For prayers/custom content

  // Access control
  isPremium: boolean;

  // Metadata
  length: number; // Character count
  readingTimeEstimate: number; // Seconds

  // Statistics
  timesShown: number;
  averageReadingTime: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface DailyContent {
  id: string;
  date: string; // YYYY-MM-DD

  // Content
  verseId: string;

  // Display
  imageUrl?: string;
  theme?: string;

  // Statistics
  viewCount: number;
  shareCount: number;
  favoriteCount: number;

  createdAt: Date;
}

export interface UserVerseInteraction {
  id: string;
  userId: string;
  verseId: string;

  // Interactions
  isFavorite: boolean;
  favoritedAt?: Date;

  notes?: string; // Premium feature
  notesUpdatedAt?: Date;

  // Statistics
  timesRead: number;
  lastReadAt: Date;
  totalReadingTime: number; // Total seconds

  createdAt: Date;
  updatedAt: Date;
}
