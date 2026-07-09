import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Card } from './ui/Card';
import type { ParkingLot } from '../types';
import { colors, radii, spacing, typography } from '../theme';

interface Props {
  lots: ParkingLot[];
}

function fillColor(percent: number): string {
  if (percent >= 90) return colors.danger;
  if (percent >= 70) return colors.warning;
  return colors.success;
}

function LotBar({ lot }: { lot: ParkingLot }) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(Math.min(100, lot.fillPercent), {
      duration: 700,
      easing: Easing.out(Easing.cubic),
    });
  }, [lot.fillPercent, width]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
    backgroundColor: fillColor(lot.fillPercent),
  }));

  return (
    <View style={styles.lot}>
      <View style={styles.lotHeader}>
        <Text style={styles.lotName}>{lot.name}</Text>
        <Text style={[styles.percent, { color: fillColor(lot.fillPercent) }]}>
          {lot.fillPercent}% full
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, fillStyle]} />
      </View>
      <Text style={styles.detail}>
        {lot.available} open · {lot.occupied}/{lot.capacity} occupied
      </Text>
    </View>
  );
}

/**
 * F009 — Dashboard widget showing mock parking lot capacities.
 */
export function ParkingWidget({ lots }: Props) {
  return (
    <Card style={styles.card}>
      <Text style={styles.heading}>Parking Availability</Text>
      {lots.length === 0 ? (
        <Text style={styles.empty}>No parking data.</Text>
      ) : (
        lots.map((lot) => <LotBar key={lot.id} lot={lot} />)
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  heading: {
    ...typography.section,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  empty: { ...typography.body, color: colors.textSecondary },
  lot: { marginBottom: spacing.md },
  lotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  lotName: {
    ...typography.bodyMedium,
    flex: 1,
    paddingRight: spacing.sm,
  },
  percent: {
    fontFamily: typography.label.fontFamily,
    fontSize: 13,
  },
  track: {
    height: 10,
    backgroundColor: colors.background,
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radii.full,
  },
  detail: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
});
