/**
 * Settings Screen
 * User preferences and app configuration
 *
 * @screen SettingsScreen
 */

import React, {useCallback} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import {Screen, Text, Card} from '@components';
import {colors, spacing, radii, typography} from '@theme';
import {useUserStore, useSubscriptionStore} from '@store';
import {revenueCatService} from '@services';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '@types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface SettingItem {
  label: string;
  value?: string | boolean;
  onPress?: () => void;
  type?: 'nav' | 'toggle' | 'info';
  destructive?: boolean;
}

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const {user, updatePreferences} = useUserStore();
  const {isPremium} = useSubscriptionStore();

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement logout
            Alert.alert('Coming Soon', 'Logout functionality will be implemented');
          },
        },
      ],
    );
  }, []);

  const handleManageSubscription = useCallback(async () => {
    if (isPremium()) {
      Alert.alert(
        'Manage Subscription',
        'To manage your subscription, please visit your device settings.\n\niOS: Settings > Apple ID > Subscriptions\nAndroid: Play Store > Subscriptions',
        [{text: 'OK'}],
      );
    } else {
      navigation.navigate('Paywall', {source: 'settings'});
    }
  }, [isPremium, navigation]);

  const handleRestorePurchases = useCallback(async () => {
    try {
      const customerInfo = await revenueCatService.restorePurchases();
      if (customerInfo?.entitlements?.active?.premium) {
        Alert.alert('Success', 'Your purchases have been restored.');
      } else {
        Alert.alert('No Purchases Found', 'No active subscriptions to restore.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to restore purchases');
    }
  }, []);

  const renderSettingItem = (item: SettingItem) => {
    return (
      <TouchableOpacity
        key={item.label}
        style={styles.settingItem}
        onPress={item.onPress}
        disabled={item.type === 'info' || item.type === 'toggle'}>
        <Text
          variant="body"
          color={item.destructive ? colors.danger : colors.textPrimary}
          style={styles.settingLabel}>
          {item.label}
        </Text>

        {item.type === 'toggle' && typeof item.value === 'boolean' && (
          <Switch
            value={item.value}
            onValueChange={item.onPress}
            trackColor={{false: colors.outline, true: colors.accent + '60'}}
            thumbColor={item.value ? colors.accent : colors.textMuted}
          />
        )}

        {item.type === 'info' && item.value && (
          <Text variant="body" color={colors.textSecondary}>
            {item.value}
          </Text>
        )}

        {item.type === 'nav' && (
          <Text variant="body" color={colors.textMuted}>
            {'>'}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderSection = (title: string, items: SettingItem[]) => {
    return (
      <View key={title} style={styles.section}>
        <Text variant="caption" color={colors.textMuted} style={styles.sectionTitle}>
          {title.toUpperCase()}
        </Text>
        <Card style={styles.sectionCard}>
          {items.map((item, index) => (
            <View key={item.label}>
              {renderSettingItem(item)}
              {index < items.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </Card>
      </View>
    );
  };

  return (
    <Screen edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text variant="display2" style={styles.title}>
          Settings
        </Text>

        {/* Subscription Section */}
        {renderSection('Subscription', [
          {
            label: isPremium() ? 'Premium Active' : 'Upgrade to Premium',
            value: isPremium() ? '✨' : undefined,
            onPress: handleManageSubscription,
            type: 'nav',
          },
          {
            label: 'Restore Purchases',
            onPress: handleRestorePurchases,
            type: 'nav',
          },
        ])}

        {/* App Blocking Settings */}
        {renderSection('Blocking', [
          {
            label: 'Reading Duration',
            value: `${user?.preferences.minReadingDuration || 30}s`,
            onPress: () => Alert.alert('Coming Soon', 'Duration settings will be implemented'),
            type: 'nav',
          },
          {
            label: 'Unlock Duration',
            value: `${Math.floor((user?.preferences.unlockDuration || 900) / 60)} min`,
            onPress: () => Alert.alert('Coming Soon', 'Duration settings will be implemented'),
            type: 'nav',
          },
          {
            label: 'Blocking Schedule',
            value: user?.preferences.blockingSchedule.mode || 'always',
            onPress: () => Alert.alert('Coming Soon', 'Schedule settings will be implemented'),
            type: 'nav',
          },
        ])}

        {/* Content Preferences */}
        {renderSection('Content', [
          {
            label: 'Bible Translation',
            value: user?.preferences.bibleTranslation || 'ESV',
            onPress: () => Alert.alert('Coming Soon', 'Translation picker will be implemented'),
            type: 'nav',
          },
          {
            label: 'Verse Categories',
            value: `${user?.preferences.verseCategories?.length || 0} selected`,
            onPress: () => Alert.alert('Coming Soon', 'Category picker will be implemented'),
            type: 'nav',
          },
        ])}

        {/* Notifications */}
        {renderSection('Notifications', [
          {
            label: 'Enable Notifications',
            value: user?.preferences.enableNotifications ?? true,
            onPress: () =>
              updatePreferences({
                enableNotifications: !user?.preferences.enableNotifications,
              }),
            type: 'toggle',
          },
          {
            label: 'Daily Verse Time',
            value: user?.preferences.dailyVerseTime || '7:00 AM',
            onPress: () => Alert.alert('Coming Soon', 'Time picker will be implemented'),
            type: 'nav',
          },
        ])}

        {/* Appearance */}
        {renderSection('Appearance', [
          {
            label: 'Theme',
            value: user?.preferences.theme || 'dark',
            onPress: () => Alert.alert('Coming Soon', 'Theme picker will be implemented'),
            type: 'nav',
          },
          {
            label: 'Font Size',
            value: user?.preferences.fontSize || 'medium',
            onPress: () => Alert.alert('Coming Soon', 'Font size picker will be implemented'),
            type: 'nav',
          },
        ])}

        {/* Support & Info */}
        {renderSection('Support', [
          {
            label: 'Help & Support',
            onPress: () => Alert.alert('Support', 'Email: support@prayscreen.app'),
            type: 'nav',
          },
          {
            label: 'Privacy Policy',
            onPress: () => Alert.alert('Coming Soon', 'Privacy policy will be shown'),
            type: 'nav',
          },
          {
            label: 'Terms of Service',
            onPress: () => Alert.alert('Coming Soon', 'Terms will be shown'),
            type: 'nav',
          },
          {
            label: 'App Version',
            value: '1.0.0',
            type: 'info',
          },
        ])}

        {/* Account Actions */}
        {renderSection('Account', [
          {
            label: 'Sign Out',
            onPress: handleLogout,
            destructive: true,
            type: 'nav',
          },
        ])}

        <View style={styles.footer}>
          <Text variant="caption" color={colors.textMuted} style={styles.footerText}>
            Made with ❤️ and 🙏
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: spacing.screenPadding,
  },
  title: {
    marginBottom: spacing.scale[8],
  },
  section: {
    marginBottom: spacing.scale[6],
  },
  sectionTitle: {
    marginBottom: spacing.scale[3],
    letterSpacing: 1,
  },
  sectionCard: {
    padding: 0,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.scale[4],
    paddingHorizontal: spacing.scale[5],
  },
  settingLabel: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.outline,
    marginLeft: spacing.scale[5],
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.scale[8],
    marginBottom: spacing.scale[4],
  },
  footerText: {
    textAlign: 'center',
  },
});
