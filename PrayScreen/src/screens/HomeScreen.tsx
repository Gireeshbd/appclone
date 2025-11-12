/**
 * Home Screen
 * Main dashboard showing blocked apps and unlock status
 *
 * @screen HomeScreen
 */

import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList, BlockedApp} from '@types';
import {Screen, Text, Button, Card} from '@components';
import {colors, spacing, radii, typography} from '@theme';
import {useAppStore, useUserStore, useSubscriptionStore} from '@store';
import {formatDuration, getTimeRemaining} from '@utils';
import {blockingService} from '@services';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const {blockedApps, currentlyUnlockedApps, unlockExpiresAt} = useAppStore();
  const {user} = useUserStore();
  const {isPremium, canAccessFeature} = useSubscriptionStore();

  const [refreshing, setRefreshing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  // Update countdown timer
  useEffect(() => {
    if (unlockExpiresAt && currentlyUnlockedApps.length > 0) {
      const interval = setInterval(() => {
        const remaining = getTimeRemaining(unlockExpiresAt);
        if (remaining.total > 0) {
          setTimeRemaining(formatDuration(Math.floor(remaining.total / 1000)));
        } else {
          setTimeRemaining('');
        }
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setTimeRemaining('');
    }
  }, [unlockExpiresAt, currentlyUnlockedApps]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // TODO: Refresh blocked apps from storage/backend
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleAddApps = useCallback(() => {
    const canAddMore = canAccessFeature('unlimited_apps') || blockedApps.length < 3;

    if (!canAddMore) {
      // Show paywall for free users trying to add more than 3 apps
      navigation.navigate('Paywall', {source: 'app_limit'});
      return;
    }

    navigation.navigate('AppSelection');
  }, [blockedApps.length, canAccessFeature, navigation]);

  const handleRemoveApp = useCallback(
    (app: BlockedApp) => {
      Alert.alert(
        'Remove App',
        `Remove ${app.appName} from blocked apps?`,
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => {
              // TODO: Remove app from blocked list
              useAppStore.getState().removeBlockedApp(app.id);
            },
          },
        ],
      );
    },
    [],
  );

  const isAppUnlocked = useCallback(
    (app: BlockedApp): boolean => {
      return currentlyUnlockedApps.includes(app.bundleId);
    },
    [currentlyUnlockedApps],
  );

  const renderBlockedApp = ({item}: {item: BlockedApp}) => {
    const unlocked = isAppUnlocked(item);

    return (
      <Card style={styles.appCard}>
        <View style={styles.appContent}>
          <View style={styles.appIcon}>
            {item.appIcon ? (
              <Image source={{uri: item.appIcon}} style={styles.iconImage} />
            ) : (
              <View style={styles.iconPlaceholder}>
                <Text variant="headline">{item.appName[0]}</Text>
              </View>
            )}
          </View>

          <View style={styles.appInfo}>
            <Text variant="body" style={styles.appName}>
              {item.appName}
            </Text>
            <Text variant="caption" color={colors.textMuted}>
              {unlocked ? `Unlocked • ${timeRemaining} left` : 'Blocked'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveApp(item)}>
            <Text variant="caption" color={colors.danger}>
              Remove
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.appStats}>
          <View style={styles.stat}>
            <Text variant="caption" color={colors.textMuted}>
              Block Attempts
            </Text>
            <Text variant="body" color={colors.textPrimary}>
              {item.blockAttempts}
            </Text>
          </View>
          <View style={styles.stat}>
            <Text variant="caption" color={colors.textMuted}>
              Unlocks
            </Text>
            <Text variant="body" color={colors.textPrimary}>
              {item.successfulUnlocks}
            </Text>
          </View>
        </View>
      </Card>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text variant="display2" style={styles.emptyTitle}>
        No Apps Blocked
      </Text>
      <Text variant="body" color={colors.textSecondary} style={styles.emptyText}>
        Add apps to start building better habits and spiritual discipline.
      </Text>
      <Button
        title="Add Apps to Block"
        variant="cta"
        onPress={handleAddApps}
        style={styles.emptyButton}
      />
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Welcome */}
      <Text variant="display2" style={styles.welcome}>
        Welcome back 🙏
      </Text>

      {/* Current unlock status */}
      {currentlyUnlockedApps.length > 0 && (
        <Card style={styles.statusCard}>
          <Text variant="headline" color={colors.success}>
            Apps Unlocked
          </Text>
          <Text variant="body" color={colors.textSecondary}>
            {currentlyUnlockedApps.length} app{currentlyUnlockedApps.length !== 1 ? 's' : ''}{' '}
            unlocked for {timeRemaining}
          </Text>
        </Card>
      )}

      {/* Quick stats */}
      {user && (
        <View style={styles.quickStats}>
          <View style={styles.statBox}>
            <Text variant="display1" color={colors.accent}>
              {user.stats.currentStreak}
            </Text>
            <Text variant="caption" color={colors.textMuted}>
              Day Streak
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text variant="display1" color={colors.accent}>
              {user.stats.totalPrayerSessions}
            </Text>
            <Text variant="caption" color={colors.textMuted}>
              Prayers
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text variant="display1" color={colors.accent}>
              {Math.floor(user.stats.totalReadingTime / 60)}
            </Text>
            <Text variant="caption" color={colors.textMuted}>
              Minutes
            </Text>
          </View>
        </View>
      )}

      {/* Section header */}
      <View style={styles.sectionHeader}>
        <Text variant="headline">Blocked Apps</Text>
        {blockedApps.length > 0 && (
          <TouchableOpacity onPress={handleAddApps}>
            <Text variant="body" color={colors.accent}>
              + Add
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Free tier limit indicator */}
      {!isPremium() && blockedApps.length > 0 && (
        <View style={styles.limitIndicator}>
          <Text variant="caption" color={colors.textMuted}>
            {blockedApps.length}/3 apps blocked (Free)
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Paywall', {source: 'home'})}>
            <Text variant="caption" color={colors.accent}>
              Upgrade for unlimited
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <Screen edges={['top']}>
      <FlatList
        data={blockedApps}
        renderItem={renderBlockedApp}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={blockedApps.length === 0 ? renderEmptyState : null}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
    padding: spacing.screenPadding,
  },
  header: {
    marginBottom: spacing.scale[6],
  },
  welcome: {
    marginBottom: spacing.scale[6],
  },
  statusCard: {
    marginBottom: spacing.scale[6],
    backgroundColor: colors.success + '15',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.scale[8],
  },
  statBox: {
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.scale[4],
  },
  limitIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.scale[4],
    paddingVertical: spacing.scale[2],
    paddingHorizontal: spacing.scale[4],
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.sm,
  },
  appCard: {
    marginBottom: spacing.scale[4],
  },
  appContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.scale[4],
  },
  appIcon: {
    marginRight: spacing.scale[4],
  },
  iconImage: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
  },
  iconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    marginBottom: spacing.scale[1],
  },
  removeButton: {
    padding: spacing.scale[2],
  },
  appStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.outline,
    paddingTop: spacing.scale[4],
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.scale[12],
  },
  emptyTitle: {
    marginBottom: spacing.scale[4],
    textAlign: 'center',
  },
  emptyText: {
    marginBottom: spacing.scale[8],
    textAlign: 'center',
    maxWidth: 280,
  },
  emptyButton: {
    minWidth: 200,
  },
});
