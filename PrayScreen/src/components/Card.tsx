/**
 * Card component based on design(1).json
 */

import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {colors, spacing, radii, shadows} from '@theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({children, style, elevated = true}) => {
  return (
    <View style={[styles.card, elevated && shadows.shadow2, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.xl,
    padding: spacing.cardPadding,
  },
});
