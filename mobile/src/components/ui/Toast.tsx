import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { colors, radii, spacing, typography } from '../../theme';

export type ToastTone = 'success' | 'error' | 'info';

interface Props {
  visible: boolean;
  message: string;
  tone?: ToastTone;
  onHide: () => void;
  durationMs?: number;
}

const TONE_BG: Record<ToastTone, string> = {
  success: colors.success,
  error: colors.danger,
  info: colors.info,
};

/** Lightweight in-app toast — replaces blocking Alert.alert for success/fail. */
export function Toast({
  visible,
  message,
  tone = 'info',
  onHide,
  durationMs = 2600,
}: Props) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    if (!visible) return;
    opacity.value = withTiming(1, { duration: 220 });
    translateY.value = withTiming(0, { duration: 220 });
    const timer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withSequence(
        withTiming(12, { duration: 200 }),
        withTiming(20, { duration: 0 }, () => {
          runOnJS(onHide)();
        }),
      );
    }, durationMs);
    return () => clearTimeout(timer);
  }, [visible, message, durationMs, onHide, opacity, translateY]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.wrap, { backgroundColor: TONE_BG[tone] }, animStyle]}>
      <Text style={styles.text}>{message}</Text>
      <Pressable onPress={onHide} hitSlop={8}>
        <Text style={styles.dismiss}>Dismiss</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.xl,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    zIndex: 50,
  },
  text: {
    ...typography.bodyMedium,
    color: colors.white,
    flex: 1,
  },
  dismiss: {
    ...typography.caption,
    color: colors.white,
    fontFamily: typography.label.fontFamily,
  },
});
