/**
 * Main tab navigator - bottom tabs for main app sections
 */

import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from '@types';
import {colors, typography} from '@theme';

// Placeholder screens
import {Screen, BodyText} from '@components';

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
        component={ProgressScreen}
        options={{
          tabBarLabel: 'Progress',
        }}
      />
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
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

// Placeholder screens
const HomeScreen = () => (
  <Screen>
    <BodyText variant="display2" color={colors.textPrimary}>
      Home
    </BodyText>
    <BodyText style={{marginTop: 16}}>
      This is where blocked apps and prayer sessions will be managed.
    </BodyText>
  </Screen>
);

const ProgressScreen = () => (
  <Screen>
    <BodyText variant="display2" color={colors.textPrimary}>
      Progress
    </BodyText>
    <BodyText style={{marginTop: 16}}>
      Analytics, streaks, and achievements will be shown here.
    </BodyText>
  </Screen>
);

const LibraryScreen = () => (
  <Screen>
    <BodyText variant="display2" color={colors.textPrimary}>
      Library
    </BodyText>
    <BodyText style={{marginTop: 16}}>
      Browse and manage Bible verses and prayers here.
    </BodyText>
  </Screen>
);

const SettingsScreen = () => (
  <Screen>
    <BodyText variant="display2" color={colors.textPrimary}>
      Settings
    </BodyText>
    <BodyText style={{marginTop: 16}}>
      App settings, preferences, and subscription management.
    </BodyText>
  </Screen>
);
