import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Chip } from './ui/Chip';
import type { ServiceType } from '../types';
import { colors, spacing } from '../theme';

export type ServiceFilters = Record<ServiceType, boolean>;

interface Props {
  filters: ServiceFilters;
  onChange: (next: ServiceFilters) => void;
}

const LABELS: { key: ServiceType; label: string; color: string }[] = [
  { key: 'restroom', label: 'Restrooms', color: colors.service.restroom },
  { key: 'accessibility', label: 'Accessibility', color: colors.service.accessibility },
  { key: 'family', label: 'Family', color: colors.service.family },
];

/**
 * F010 — Filtering toggles for restroom, accessibility, and family services on the map.
 */
export function ServiceFilterToggles({ filters, onChange }: Props) {
  return (
    <View style={styles.row}>
      {LABELS.map(({ key, label, color }) => (
        <Chip
          key={key}
          label={label}
          color={color}
          active={filters[key]}
          onPress={() => onChange({ ...filters, [key]: !filters[key] })}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
});
