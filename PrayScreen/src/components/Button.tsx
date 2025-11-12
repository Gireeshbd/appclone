/**
 * Button component based on design(1).json
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import {colors, typography, spacing, radii, shadows} from '@theme';

type ButtonVariant = 'primary' | 'cta' | 'ghost';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const buttonStyle = [
    styles.base,
    variant === 'primary' && styles.primary,
    variant === 'cta' && styles.cta,
    variant === 'ghost' && styles.ghost,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    variant === 'primary' && styles.primaryText,
    variant === 'cta' && styles.ctaText,
    variant === 'ghost' && styles.ghostText,
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator color={variant === 'cta' ? colors.white : colors.textPrimary} />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.buttonPaddingX,
    paddingVertical: spacing.buttonPaddingY,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  // Primary button (from design(1).json)
  primary: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.xl,
    ...shadows.shadow2,
  },
  primaryText: {
    ...typography.button,
    color: colors.textPrimary,
  },
  // CTA button (from design(1).json)
  cta: {
    backgroundColor: colors.black,
    borderRadius: radii.lg,
  },
  ctaText: {
    ...typography.button,
    color: colors.white,
  },
  // Ghost button (from design(1).json)
  ghost: {
    backgroundColor: 'transparent',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  ghostText: {
    ...typography.button,
    color: colors.textPrimary,
  },
  // Disabled state
  disabled: {
    backgroundColor: colors.disabledBg,
  },
  disabledText: {
    color: colors.disabledText,
  },
  text: {
    ...typography.button,
  },
});
