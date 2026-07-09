import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { WeatherAlert } from '../types';

interface Props {
  weather: WeatherAlert | null;
}

const LEVEL_COLORS: Record<WeatherAlert['alertLevel'], string> = {
  none: '#2E7D32',
  info: '#0277BD',
  warning: '#EF6C00',
  danger: '#C62828',
};

/**
 * F014 — Banner for environmental / heat safety warnings.
 */
export function WeatherBanner({ weather }: Props) {
  if (!weather) {
    return null;
  }

  const bg = LEVEL_COLORS[weather.alertLevel] ?? LEVEL_COLORS.info;

  return (
    <View style={[styles.banner, { backgroundColor: bg }]} accessibilityRole="alert">
      <Text style={styles.title}>Weather & Heat Safety</Text>
      <Text style={styles.meta}>
        {weather.tempF}°F · Heat index {weather.heatIndex}°F · {weather.alertLevel.toUpperCase()}
      </Text>
      <Text style={styles.message}>{weather.message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 10,
    padding: 14,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  meta: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginBottom: 6,
  },
  message: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
});
