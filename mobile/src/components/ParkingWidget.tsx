import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ParkingLot } from '../types';

interface Props {
  lots: ParkingLot[];
}

function fillColor(percent: number): string {
  if (percent >= 90) return '#C62828';
  if (percent >= 70) return '#EF6C00';
  return '#2E7D32';
}

/**
 * F009 — Dashboard widget showing mock parking lot capacities.
 */
export function ParkingWidget({ lots }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Parking Availability</Text>
      {lots.length === 0 ? (
        <Text style={styles.empty}>No parking data.</Text>
      ) : (
        lots.map((lot) => (
          <View key={lot.id} style={styles.lot}>
            <View style={styles.lotHeader}>
              <Text style={styles.lotName}>{lot.name}</Text>
              <Text style={[styles.percent, { color: fillColor(lot.fillPercent) }]}>
                {lot.fillPercent}% full
              </Text>
            </View>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  {
                    width: `${Math.min(100, lot.fillPercent)}%`,
                    backgroundColor: fillColor(lot.fillPercent),
                  },
                ]}
              />
            </View>
            <Text style={styles.detail}>
              {lot.available} open · {lot.occupied}/{lot.capacity} occupied
            </Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 12,
  },
  empty: { color: '#666' },
  lot: { marginBottom: 14 },
  lotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  lotName: { fontSize: 14, fontWeight: '600', color: '#222', flex: 1, paddingRight: 8 },
  percent: { fontSize: 13, fontWeight: '700' },
  track: {
    height: 8,
    backgroundColor: '#EEEEEE',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 4 },
  detail: { marginTop: 4, fontSize: 12, color: '#666' },
});
