/**
 * Text component based on design(1).json typography system
 */

import React from 'react';
import {Text as RNText, StyleSheet, TextStyle, StyleProp, TextProps as RNTextProps} from 'react-native';
import {typography, colors, TypographyKey} from '@theme';

interface TextProps extends RNTextProps {
  variant?: TypographyKey;
  color?: string;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color = colors.textPrimary,
  style,
  children,
  ...props
}) => {
  const textStyle = [
    typography[variant],
    {color},
    style,
  ];

  return (
    <RNText style={textStyle} {...props}>
      {children}
    </RNText>
  );
};

// Convenience components for common text variants
export const DisplayText: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="display1" {...props} />
);

export const TitleText: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="title" {...props} />
);

export const HeadlineText: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="headline" {...props} />
);

export const BodyText: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="body" {...props} />
);

export const CaptionText: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="caption" {...props} />
);
