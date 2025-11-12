/**
 * Screen wrapper component with safe area handling
 */

import React from 'react';
import {View, StyleSheet, ViewStyle, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, spacing} from '@theme';

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
  edges?: Array<'top' | 'bottom' | 'left' | 'right'>;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  style,
  scrollable = false,
  edges = ['top', 'bottom'],
}) => {
  const Container = scrollable ? ScrollView : View;

  return (
    <SafeAreaView style={[styles.safeArea, style]} edges={edges}>
      <Container
        style={scrollable ? styles.scrollContent : styles.content}
        contentContainerStyle={scrollable ? styles.scrollContentContainer : undefined}
        showsVerticalScrollIndicator={false}>
        {children}
      </Container>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.screenPadding,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: spacing.screenPadding,
  },
});
