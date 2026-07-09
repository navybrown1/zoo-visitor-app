import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useIsDesktop } from '../../hooks/useIsDesktop';
import { colors, spacing } from '../../theme';

interface Props {
  children: ReactNode;
  style?: ViewStyle;
  /** Wider content column on desktop (default 1120). */
  maxWidth?: number;
}

/** Centers page content; full-bleed on mobile, readable website column on desktop. */
export function PageContainer({ children, style, maxWidth = 1120 }: Props) {
  const isDesktop = useIsDesktop();

  return (
    <View
      style={[
        styles.base,
        isDesktop && { paddingHorizontal: spacing.xl, paddingTop: spacing.md },
        style,
      ]}
    >
      <View style={[styles.inner, isDesktop && { maxWidth, width: '100%', alignSelf: 'center' }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
    width: '100%',
  },
});
