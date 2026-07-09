import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import type { WeatherAlert } from '../types';
import { colors, radii, spacing, typography } from '../theme';

interface Props {
  weather: WeatherAlert | null;
}

const LEVEL: Record<
  WeatherAlert['alertLevel'],
  { colors: [string, string]; icon: keyof typeof Ionicons.glyphMap }
> = {
  none: { colors: [colors.success, colors.primary], icon: 'sunny-outline' },
  info: { colors: [colors.info, '#01579B'], icon: 'information-circle-outline' },
  warning: { colors: [colors.warning, '#E65100'], icon: 'thermometer-outline' },
  danger: { colors: [colors.danger, '#8E0000'], icon: 'warning-outline' },
};

/**
 * F014 — Banner for environmental / heat safety warnings.
 */
export function WeatherBanner({ weather }: Props) {
  if (!weather) return null;
  const level = LEVEL[weather.alertLevel] ?? LEVEL.info;

  return (
    <MotiView
      from={{ opacity: 0, translateY: -8 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 350 }}
      style={styles.wrap}
    >
      <LinearGradient colors={level.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.banner}>
        <View style={styles.row}>
          <Ionicons name={level.icon} size={28} color={colors.white} />
          <View style={styles.copy}>
            <Text style={styles.title}>Weather & Heat Safety</Text>
            <Text style={styles.meta}>
              {weather.tempF}°F · Heat index {weather.heatIndex}°F · {weather.alertLevel.toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={styles.message}>{weather.message}</Text>
      </LinearGradient>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  banner: {
    borderRadius: radii.md,
    padding: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  copy: { flex: 1 },
  title: {
    fontFamily: typography.section.fontFamily,
    fontSize: 16,
    color: colors.white,
  },
  meta: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  message: {
    ...typography.body,
    color: colors.white,
  },
});
