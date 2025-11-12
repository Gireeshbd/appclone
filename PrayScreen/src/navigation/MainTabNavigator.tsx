/**
 * Main tab navigator - bottom tabs for main app sections
 */

import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from '@types';
import {colors, typography} from '@theme';
import {HomeScreen, SettingsScreen} from '@screens';
import {Screen, Text} from '@components';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.outline,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          ...typography.caption,
          fontSize: 11,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressPlaceholder}
        options={{
          tabBarLabel: 'Progress',
        }}
      />
      <Tab.Screen
        name="Library"
        component={LibraryPlaceholder}
        options={{
          tabBarLabel: 'Library',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};

// Placeholder screens for features not yet implemented
const ProgressPlaceholder = () => (
  <Screen>
    <Text variant="display2" color={colors.textPrimary}>
      Progress
    </Text>
    <Text style={{marginTop: 16}}>
      Analytics, streaks, and achievements will be shown here.
    </Text>
  </Screen>
);

const LibraryPlaceholder = () => (
  <Screen>
    <Text variant="display2" color={colors.textPrimary}>
      Library
    </Text>
    <Text style={{marginTop: 16}}>
      Browse and manage Bible verses and prayers here.
    </Text>
  </Screen>
);
