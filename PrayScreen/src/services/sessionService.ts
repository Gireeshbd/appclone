/**
 * Prayer Session Service
 * Manages prayer session creation, tracking, and statistics
 *
 * @module services/sessionService
 */

import {PrayerSession, BypassReason} from '@types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSIONS_KEY = '@prayscreen_sessions';
const MAX_STORED_SESSIONS = 100; // Keep last 100 sessions

/**
 * Prayer Session Service Class
 * Handles session lifecycle and persistence
 */
class SessionService {
  /**
   * Create a new prayer session
   */
  async createSession(params: {
    userId: string;
    verseId: string;
    verseText: string;
    verseReference?: string;
    triggeredByApps: string[];
    requiredDuration: number;
  }): Promise<PrayerSession> {
    const session: PrayerSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: params.userId,
      verseId: params.verseId,
      verseText: params.verseText,
      verseReference: params.verseReference,
      startedAt: new Date(),
      completedAt: new Date(), // Will be updated when completed
      duration: 0,
      requiredDuration: params.requiredDuration,
      triggeredBy: params.triggeredByApps,
      wasCompleted: false,
      appsUnlocked: [],
      unlockDuration: 0,
      deviceType: 'ios', // TODO: Detect actual device type
      appVersion: '1.0.0', // TODO: Get from app config
      createdAt: new Date(),
    };

    return session;
  }

  /**
   * Complete a prayer session
   */
  async completeSession(params: {
    session: PrayerSession;
    wasCompleted: boolean;
    actualDuration: number;
    appsUnlocked: string[];
    unlockDuration: number;
    bypassReason?: BypassReason;
  }): Promise<PrayerSession> {
    const completedSession: PrayerSession = {
      ...params.session,
      completedAt: new Date(),
      duration: params.actualDuration,
      wasCompleted: params.wasCompleted,
      bypassReason: params.bypassReason,
      appsUnlocked: params.appsUnlocked,
      unlockDuration: params.unlockDuration,
    };

    // Save to storage
    await this.saveSession(completedSession);

    return completedSession;
  }

  /**
   * Save session to local storage
   */
  private async saveSession(session: PrayerSession): Promise<void> {
    try {
      const existingSessions = await this.getSessions();
      const updatedSessions = [session, ...existingSessions].slice(0, MAX_STORED_SESSIONS);
      await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(updatedSessions));
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }

  /**
   * Get all stored sessions
   */
  async getSessions(): Promise<PrayerSession[]> {
    try {
      const sessionsJson = await AsyncStorage.getItem(SESSIONS_KEY);
      if (!sessionsJson) return [];

      const sessions = JSON.parse(sessionsJson);
      // Convert date strings back to Date objects
      return sessions.map((s: any) => ({
        ...s,
        startedAt: new Date(s.startedAt),
        completedAt: new Date(s.completedAt),
        createdAt: new Date(s.createdAt),
      }));
    } catch (error) {
      console.error('Error loading sessions:', error);
      return [];
    }
  }

  /**
   * Get sessions for a specific date range
   */
  async getSessionsInRange(startDate: Date, endDate: Date): Promise<PrayerSession[]> {
    const allSessions = await this.getSessions();
    return allSessions.filter(
      s => s.startedAt >= startDate && s.startedAt <= endDate,
    );
  }

  /**
   * Get today's sessions
   */
  async getTodaySessions(): Promise<PrayerSession[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.getSessionsInRange(today, tomorrow);
  }

  /**
   * Calculate user statistics from sessions
   */
  async calculateStats(): Promise<{
    totalSessions: number;
    totalReadingTime: number;
    completedSessions: number;
    bypassedSessions: number;
    averageReadingTime: number;
    currentStreak: number;
    longestStreak: number;
  }> {
    const sessions = await this.getSessions();
    const completedSessions = sessions.filter(s => s.wasCompleted);

    const totalReadingTime = sessions.reduce((acc, s) => acc + s.duration, 0);
    const averageReadingTime =
      completedSessions.length > 0
        ? totalReadingTime / completedSessions.length
        : 0;

    const {currentStreak, longestStreak} = this.calculateStreaks(sessions);

    return {
      totalSessions: sessions.length,
      totalReadingTime,
      completedSessions: completedSessions.length,
      bypassedSessions: sessions.length - completedSessions.length,
      averageReadingTime,
      currentStreak,
      longestStreak,
    };
  }

  /**
   * Calculate current and longest streaks
   */
  private calculateStreaks(sessions: PrayerSession[]): {
    currentStreak: number;
    longestStreak: number;
  } {
    if (sessions.length === 0) {
      return {currentStreak: 0, longestStreak: 0};
    }

    // Sort sessions by date (newest first)
    const sortedSessions = [...sessions].sort(
      (a, b) => b.startedAt.getTime() - a.startedAt.getTime(),
    );

    // Group sessions by date
    const sessionsByDate = new Map<string, PrayerSession[]>();
    sortedSessions.forEach(session => {
      const dateKey = session.startedAt.toISOString().split('T')[0];
      if (!sessionsByDate.has(dateKey)) {
        sessionsByDate.set(dateKey, []);
      }
      sessionsByDate.get(dateKey)!.push(session);
    });

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let checkDate = new Date(today);

    // Calculate current streak
    while (true) {
      const dateKey = checkDate.toISOString().split('T')[0];
      const sessionsOnDate = sessionsByDate.get(dateKey);

      if (sessionsOnDate && sessionsOnDate.some(s => s.wasCompleted)) {
        currentStreak++;
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        // Allow one day gap for today
        if (checkDate.getTime() === today.getTime()) {
          // Today has no sessions yet, continue checking yesterday
        } else {
          break;
        }
      }

      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Calculate longest streak from all history
    const allDates = Array.from(sessionsByDate.keys()).sort().reverse();
    tempStreak = 0;

    for (let i = 0; i < allDates.length; i++) {
      const dateKey = allDates[i];
      const sessionsOnDate = sessionsByDate.get(dateKey);

      if (sessionsOnDate && sessionsOnDate.some(s => s.wasCompleted)) {
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
    }

    return {currentStreak, longestStreak};
  }

  /**
   * Clear all sessions (for testing/debugging)
   */
  async clearSessions(): Promise<void> {
    await AsyncStorage.removeItem(SESSIONS_KEY);
  }
}

// Export singleton instance
export const sessionService = new SessionService();
