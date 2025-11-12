/**
 * Main App Component
 */

import React, {useEffect} from 'react';
import {StatusBar, LogBox} from 'react-native';
import {RootNavigator} from '@navigation';
import {colors} from '@theme';

// Ignore specific warnings during development
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const App: React.FC = () => {
  useEffect(() => {
    // Initialize app services
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // TODO: Initialize RevenueCat
      // TODO: Load user data from storage
      // TODO: Check subscription status
      // TODO: Initialize notifications
      console.log('App initialized');
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  };

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background}
        translucent
      />
      <RootNavigator />
    </>
  );
};

export default App;
