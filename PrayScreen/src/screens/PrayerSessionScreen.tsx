/**
 * Prayer Session Screen
 * Full-screen modal that displays a verse and timer before unlocking apps
 *
 * @screen PrayerSessionScreen
 */

import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, VerseContent, PrayerSession} from '@types';
import {Screen, Text, Button, Card} from '@components';
import {colors, spacing, radii, typography} from '@theme';
import {useTimer, useVerse} from '@hooks';
import {formatTime} from '@utils';
import {sessionService} from '@services';
import {useUserStore, useAppStore} from '@store';

type Props = NativeStackScreenProps<RootStackParamList, 'PrayerSession'>;

export const PrayerSessionScreen: React.FC<Props> = ({route, navigation}) => {
  const {verseId, triggeredByApps} = route.params;
  const {user} = useUserStore();
  const {unlockApps} = useAppStore();
  const {getRandomVerse, getVerseById, recordReadingTime} = useVerse();

  const [verse, setVerse] = useState<VerseContent | null>(null);
  const [session, setSession] = useState<PrayerSession | null>(null);
  const [loading, setLoading] = useState(true);

  const requiredDuration = user?.preferences.minReadingDuration || 30;
  const unlockDuration = user?.preferences.unlockDuration || 900; // 15 min default

  const {
    seconds,
    isComplete,
    progress,
    start,
  } = useTimer({
    initialSeconds: requiredDuration,
    autoStart: true,
    onComplete: handleTimerComplete,
  });

  // Load verse on mount
  useEffect(() => {
    loadVerse();
  }, []);

  const loadVerse = async () => {
    setLoading(true);
    try {
      let selectedVerse: VerseContent | null = null;

      if (verseId) {
        selectedVerse = getVerseById(verseId);
      }

      if (!selectedVerse) {
        selectedVerse = await getRandomVerse();
      }

      if (selectedVerse && user) {
        setVerse(selectedVerse);

        // Create session
        const newSession = await sessionService.createSession({
          userId: user.id,
          verseId: selectedVerse.id,
          verseText: selectedVerse.text,
          verseReference: selectedVerse.reference,
          triggeredByApps,
          requiredDuration,
        });

        setSession(newSession);
      }
    } catch (error) {
      console.error('Error loading verse:', error);
      Alert.alert('Error', 'Failed to load verse. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  function handleTimerComplete() {
    // Timer completed, user can now unlock
  }

  const handleUnlock = useCallback(async () => {
    if (!session || !verse || !user) return;

    try {
      const actualDuration = requiredDuration - seconds;

      // Complete the session
      await sessionService.completeSession({
        session,
        wasCompleted: true,
        actualDuration,
        appsUnlocked: triggeredByApps,
        unlockDuration,
      });

      // Record reading time for this verse
      recordReadingTime(verse.id, actualDuration);

      // Unlock the apps in the app store
      unlockApps(triggeredByApps, unlockDuration);

      // Navigate back
      navigation.goBack();

      // Show success message
      Alert.alert(
        'Apps Unlocked',
        `You can now use your apps for ${Math.floor(unlockDuration / 60)} minutes.`,
      );
    } catch (error) {
      console.error('Error completing session:', error);
      Alert.alert('Error', 'Failed to unlock apps. Please try again.');
    }
  }, [session, verse, user, seconds, triggeredByApps, unlockDuration, navigation]);

  const handleClose = useCallback(() => {
    Alert.alert(
      'Exit Prayer Session',
      'Are you sure you want to exit without completing your prayer?',
      [
        {text: 'Continue Reading', style: 'cancel'},
        {
          text: 'Exit',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ],
    );
  }, [navigation]);

  if (loading) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingText}>Loading your verse...</Text>
        </View>
      </Screen>
    );
  }

  if (!verse) {
    return (
      <Screen>
        <View style={styles.errorContainer}>
          <Text variant="headline">Failed to Load Verse</Text>
          <Button title="Try Again" onPress={loadVerse} style={styles.retryButton} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen edges={['top', 'bottom']} style={styles.screen}>
      {/* Close button */}
      <View style={styles.header}>
        <Button
          title="✕"
          variant="ghost"
          onPress={handleClose}
          style={styles.closeButton}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Timer Circle */}
        <View style={styles.timerContainer}>
          <View style={styles.timerCircle}>
            <View
              style={[
                styles.timerProgress,
                {
                  transform: [{scaleY: progress}],
                },
              ]}
            />
            <View style={styles.timerInner}>
              <Text variant="display1" style={styles.timerText}>
                {formatTime(seconds)}
              </Text>
              {!isComplete && (
                <Text variant="caption" color={colors.textSecondary}>
                  Keep reading...
                </Text>
              )}
              {isComplete && (
                <Text variant="caption" color={colors.success}>
                  You can unlock now
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Verse Card */}
        <Card style={styles.verseCard}>
          {verse.reference && (
            <Text variant="caption" color={colors.textSecondary} style={styles.reference}>
              {verse.reference}
            </Text>
          )}
          {verse.title && (
            <Text variant="headline" style={styles.title}>
              {verse.title}
            </Text>
          )}
          <Text variant="bodyLg" style={styles.verseText}>
            {verse.text}
          </Text>
          {verse.author && (
            <Text variant="caption" color={colors.textMuted} style={styles.author}>
              — {verse.author}
            </Text>
          )}
        </Card>

        {/* Unlock Button */}
        <Button
          title={isComplete ? 'Unlock Apps' : `Wait ${formatTime(seconds)}`}
          variant="cta"
          onPress={handleUnlock}
          disabled={!isComplete}
          style={styles.unlockButton}
        />

        <Text variant="bodySm" color={colors.textMuted} style={styles.hint}>
          Apps will be unlocked for {Math.floor(unlockDuration / 60)} minutes
        </Text>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: spacing.screenPadding,
    paddingBottom: 0,
  },
  closeButton: {
    width: 44,
    height: 44,
    minHeight: 44,
    borderRadius: radii.pill,
  },
  content: {
    padding: spacing.screenPadding,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.scale[4],
    ...typography.body,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.screenPadding,
  },
  retryButton: {
    marginTop: spacing.scale[6],
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: spacing.scale[10],
  },
  timerCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  timerProgress: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: colors.accent + '20',
    transformOrigin: 'bottom',
  },
  timerInner: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  timerText: {
    marginBottom: spacing.scale[2],
  },
  verseCard: {
    width: '100%',
    marginBottom: spacing.scale[8],
  },
  reference: {
    marginBottom: spacing.scale[3],
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    marginBottom: spacing.scale[4],
    textAlign: 'center',
  },
  verseText: {
    lineHeight: 32,
    textAlign: 'center',
  },
  author: {
    marginTop: spacing.scale[4],
    textAlign: 'center',
    fontStyle: 'italic',
  },
  unlockButton: {
    width: '100%',
    marginBottom: spacing.scale[4],
  },
  hint: {
    textAlign: 'center',
  },
});
