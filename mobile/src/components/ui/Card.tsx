import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radii, spacing } from '../../theme';

interface Props {
  children: ReactNode;
  style?: ViewStyle;
  padded?: boolean;
  accentBorder?: string;
}

/** Elevated surface card used across Dashboard, Tickets, and Map. */
export function Card({ children, style, padded = true, accentBorder }: Props) {
  return (
    <View
      style={[
        styles.card,
        padded && styles.padded,
        accentBorder ? { borderLeftWidth: 4, borderLeftColor: accentBorder } : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    // Soft elevation for native + web
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  padded: {
    padding: spacing.lg,
  },
});
