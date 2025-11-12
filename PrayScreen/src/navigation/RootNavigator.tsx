/**
 * Root navigator - handles main app navigation flow
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '@types';

// Placeholder screens - will be implemented
import {MainTabNavigator} from './MainTabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  // TODO: Check if user has completed onboarding
  const hasCompletedOnboarding = true; // Placeholder

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}>
        {!hasCompletedOnboarding ? (
          <Stack.Screen name="Onboarding" component={PlaceholderScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen
              name="PrayerSession"
              component={PlaceholderScreen}
              options={{
                presentation: 'fullScreenModal',
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name="Paywall"
              component={PlaceholderScreen}
              options={{
                presentation: 'modal',
              }}
            />
            <Stack.Screen name="Settings" component={PlaceholderScreen} />
            <Stack.Screen name="AppSelection" component={PlaceholderScreen} />
            <Stack.Screen name="VerseDetail" component={PlaceholderScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Placeholder screen component
const PlaceholderScreen = () => {
  const {Screen, BodyText} = require('@components');
  return (
    <Screen>
      <BodyText>Placeholder Screen</BodyText>
    </Screen>
  );
};
