/**
 * App Selection Screen
 * Allows users to select apps to block
 *
 * @screen AppSelectionScreen
 */

import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, InstalledApp, BlockedApp} from '@types';
import {Screen, Text, Button, Card} from '@components';
import {colors, spacing, radii, typography} from '@theme';
import {useAppStore, useSubscriptionStore} from '@store';
import {blockingService} from '@services';

type Props = NativeStackScreenProps<RootStackParamList, 'AppSelection'>;

export const AppSelectionScreen: React.FC<Props> = ({navigation}) => {
  const {blockedApps, addBlockedApp} = useAppStore();
  const {canAccessFeature} = useSubscriptionStore();

  const [installedApps, setInstalledApps] = useState<InstalledApp[]>([]);
  const [selectedApps, setSelectedApps] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInstalledApps();
  }, []);

  const loadInstalledApps = async () => {
    setLoading(true);
    try {
      const apps = await blockingService.getInstalledApps();

      // Filter out already blocked apps
      const blockedBundleIds = new Set(blockedApps.map(app => app.bundleId));
      const availableApps = apps.filter(app => !blockedBundleIds.has(app.bundleId));

      setInstalledApps(availableApps);
    } catch (error) {
      console.error('Error loading installed apps:', error);
      Alert.alert('Error', 'Failed to load installed apps');
    } finally {
      setLoading(false);
    }
  };

  const toggleAppSelection = useCallback(
    (bundleId: string) => {
      const newSelected = new Set(selectedApps);

      if (newSelected.has(bundleId)) {
        newSelected.delete(bundleId);
      } else {
        // Check if user can add more apps
        const totalAppsAfterSelection = blockedApps.length + newSelected.size + 1;
        const canAddUnlimited = canAccessFeature('unlimited_apps');

        if (!canAddUnlimited && totalAppsAfterSelection > 3) {
          Alert.alert(
            'Upgrade Required',
            'Free plan allows blocking up to 3 apps. Upgrade to Premium to block unlimited apps.',
            [
              {text: 'Cancel', style: 'cancel'},
              {
                text: 'Upgrade',
                onPress: () => navigation.navigate('Paywall', {source: 'app_limit'}),
              },
            ],
          );
          return;
        }

        newSelected.add(bundleId);
      }

      setSelectedApps(newSelected);
    },
    [selectedApps, blockedApps.length, canAccessFeature, navigation],
  );

  const handleSave = useCallback(async () => {
    if (selectedApps.size === 0) {
      Alert.alert('No Apps Selected', 'Please select at least one app to block');
      return;
    }

    try {
      // Convert selected apps to BlockedApp objects
      const appsToBlock = installedApps
        .filter(app => selectedApps.has(app.bundleId))
        .map(
          (app): BlockedApp => ({
            id: `app_${Date.now()}_${app.bundleId}`,
            userId: 'user_1', // TODO: Get from user store
            bundleId: app.bundleId,
            appName: app.appName,
            appIcon: app.appIcon,
            isBlocked: true,
            blockedAt: new Date(),
            isUnlocked: false,
            blockAttempts: 0,
            successfulUnlocks: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        );

      // Add to blocked apps store
      appsToBlock.forEach(app => addBlockedApp(app));

      // Enable blocking via native module
      const bundleIds = appsToBlock.map(app => app.bundleId);
      await blockingService.blockApps(bundleIds);

      navigation.goBack();

      Alert.alert(
        'Apps Blocked',
        `Successfully blocked ${appsToBlock.length} app${appsToBlock.length > 1 ? 's' : ''}`,
      );
    } catch (error) {
      console.error('Error blocking apps:', error);
      Alert.alert('Error', 'Failed to block apps. Please try again.');
    }
  }, [selectedApps, installedApps, addBlockedApp, navigation]);

  const filteredApps = installedApps.filter(app =>
    app.appName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderApp = ({item}: {item: InstalledApp}) => {
    const isSelected = selectedApps.has(item.bundleId);

    return (
      <TouchableOpacity
        style={[styles.appItem, isSelected && styles.appItemSelected]}
        onPress={() => toggleAppSelection(item.bundleId)}
        activeOpacity={0.7}>
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

          <Text variant="body" style={styles.appName}>
            {item.appName}
          </Text>
        </View>

        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingText}>Loading installed apps...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="display2" style={styles.title}>
            Select Apps to Block
          </Text>
          <Text variant="body" color={colors.textSecondary} style={styles.subtitle}>
            Choose apps that distract you from what matters most
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search apps..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Selected count */}
        {selectedApps.size > 0 && (
          <View style={styles.selectedCount}>
            <Text variant="body" color={colors.accent}>
              {selectedApps.size} app{selectedApps.size > 1 ? 's' : ''} selected
            </Text>
          </View>
        )}

        {/* Apps list */}
        <FlatList
          data={filteredApps}
          renderItem={renderApp}
          keyExtractor={item => item.bundleId}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text variant="body" color={colors.textMuted}>
                No apps found
              </Text>
            </View>
          }
        />

        {/* Bottom buttons */}
        <View style={styles.bottomButtons}>
          <Button
            title="Cancel"
            variant="ghost"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
          />
          <Button
            title={`Block ${selectedApps.size} App${selectedApps.size !== 1 ? 's' : ''}`}
            variant="cta"
            onPress={handleSave}
            disabled={selectedApps.size === 0}
            style={styles.saveButton}
          />
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  header: {
    padding: spacing.screenPadding,
    paddingBottom: spacing.scale[6],
  },
  title: {
    marginBottom: spacing.scale[3],
  },
  subtitle: {
    maxWidth: '90%',
  },
  searchContainer: {
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.scale[4],
  },
  searchInput: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.md,
    paddingHorizontal: spacing.scale[4],
    paddingVertical: spacing.scale[4],
    ...typography.body,
    color: colors.textPrimary,
  },
  selectedCount: {
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.scale[3],
  },
  listContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.scale[4],
  },
  appItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.lg,
    padding: spacing.scale[4],
    marginBottom: spacing.scale[3],
    borderWidth: 2,
    borderColor: 'transparent',
  },
  appItemSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accent + '10',
  },
  appContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  appName: {
    flex: 1,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.outline,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  checkmark: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    padding: spacing.scale[8],
    alignItems: 'center',
  },
  bottomButtons: {
    flexDirection: 'row',
    padding: spacing.screenPadding,
    paddingTop: spacing.scale[4],
    gap: spacing.scale[3],
    borderTopWidth: 1,
    borderTopColor: colors.outline,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 2,
  },
});
