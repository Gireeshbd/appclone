/**
 * Root navigator - handles main app navigation flow
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '@types';
import {MainTabNavigator} from './MainTabNavigator';
import {
  PrayerSessionScreen,
  PaywallScreen,
  AppSelectionScreen,
} from '@screens';
import {Screen, Text} from '@components';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  // TODO: Check if user has completed onboarding from storage
  const hasCompletedOnboarding = true; // Placeholder

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}>
        {!hasCompletedOnboarding ? (
          <Stack.Screen name="Onboarding" component={OnboardingPlaceholder} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen
              name="PrayerSession"
              component={PrayerSessionScreen}
              options={{
                presentation: 'fullScreenModal',
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name="Paywall"
              component={PaywallScreen}
              options={{
                presentation: 'modal',
              }}
            />
            <Stack.Screen name="AppSelection" component={AppSelectionScreen} />
            <Stack.Screen name="VerseDetail" component={VersePlaceholder} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Placeholder screens for not yet implemented features
const OnboardingPlaceholder = () => (
  <Screen>
    <Text variant="display2">Onboarding</Text>
    <Text>Welcome flow will be implemented here</Text>
  </Screen>
);

const VersePlaceholder = () => (
  <Screen>
    <Text variant="display2">Verse Detail</Text>
    <Text>Verse detail screen will be implemented here</Text>
  </Screen>
);
