import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { ServiceType } from '../types';

export type ServiceFilters = Record<ServiceType, boolean>;

interface Props {
  filters: ServiceFilters;
  onChange: (next: ServiceFilters) => void;
}

const LABELS: { key: ServiceType; label: string; color: string }[] = [
  { key: 'restroom', label: 'Restrooms', color: '#1565C0' },
  { key: 'accessibility', label: 'Accessibility', color: '#6A1B9A' },
  { key: 'family', label: 'Family', color: '#E65100' },
];

/**
 * F010 — Filtering toggles for restroom, accessibility, and family services on the map.
 */
export function ServiceFilterToggles({ filters, onChange }: Props) {
  return (
    <View style={styles.row}>
      {LABELS.map(({ key, label, color }) => {
        const active = filters[key];
        return (
          <Pressable
            key={key}
            onPress={() => onChange({ ...filters, [key]: !active })}
            style={[styles.chip, { borderColor: color }, active && { backgroundColor: color }]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  chip: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  chipTextActive: {
    color: '#fff',
  },
});
