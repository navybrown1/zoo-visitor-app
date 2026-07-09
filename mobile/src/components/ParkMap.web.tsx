import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import type { Exhibit, GuestService, LatLng } from '../types';

const SERVICE_COLORS: Record<GuestService['type'], string> = {
  restroom: '#1565C0',
  accessibility: '#6A1B9A',
  family: '#E65100',
};

interface Props {
  entrance: LatLng;
  exhibits: Exhibit[];
  services: GuestService[];
  routeCoords: LatLng[];
  showsUserLocation: boolean;
  onExhibitPress: (exhibit: Exhibit) => void;
}

/**
 * Web fallback for the park map (react-native-maps is not supported on web).
 * Shows an interactive list of exhibits/services with mock route status.
 */
export function ParkMap({
  entrance,
  exhibits,
  services,
  routeCoords,
  onExhibitPress,
}: Props) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Park Map (Web Preview)</Text>
        <Text style={styles.bannerBody}>
          Native GPS map runs on iOS/Android. On web, use the lists below to preview
          exhibits, guest services, and mock routing.
        </Text>
        <Text style={styles.coords}>
          Entrance: {entrance.latitude.toFixed(4)}, {entrance.longitude.toFixed(4)}
        </Text>
      </View>

      <Text style={styles.section}>Exhibits — tap to route</Text>
      {exhibits.map((ex) => (
        <Pressable key={ex.id} style={styles.card} onPress={() => onExhibitPress(ex)}>
          <Text style={styles.cardTitle}>{ex.name}</Text>
          <Text style={styles.cardMeta}>{ex.description}</Text>
          <Text style={styles.cardCoords}>
            {ex.latitude.toFixed(4)}, {ex.longitude.toFixed(4)}
          </Text>
        </Pressable>
      ))}

      <Text style={styles.section}>Guest services (filtered)</Text>
      {services.map((svc) => (
        <View
          key={svc.id}
          style={[styles.card, { borderLeftColor: SERVICE_COLORS[svc.type], borderLeftWidth: 4 }]}
        >
          <Text style={styles.cardTitle}>{svc.name}</Text>
          <Text style={styles.cardMeta}>{svc.type}</Text>
        </View>
      ))}

      {routeCoords.length > 1 && (
        <View style={styles.routeBox}>
          <Text style={styles.routeTitle}>Mock route ({routeCoords.length} points)</Text>
          {routeCoords.map((c, i) => (
            <Text key={`${c.latitude}-${i}`} style={styles.routePoint}>
              {i + 1}. {c.latitude.toFixed(4)}, {c.longitude.toFixed(4)}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8F5E9' },
  content: { padding: 12, paddingBottom: 24 },
  banner: {
    backgroundColor: '#1B5E20',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  bannerTitle: { color: '#fff', fontWeight: '800', fontSize: 16 },
  bannerBody: { color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 6, lineHeight: 18 },
  coords: { color: 'rgba(255,255,255,0.75)', fontSize: 11, marginTop: 8 },
  section: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 8,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  cardTitle: { fontWeight: '700', fontSize: 15, color: '#222' },
  cardMeta: { fontSize: 13, color: '#555', marginTop: 2 },
  cardCoords: { fontSize: 11, color: '#888', marginTop: 4 },
  routeBox: {
    marginTop: 8,
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    padding: 12,
  },
  routeTitle: { fontWeight: '700', marginBottom: 6, color: '#E65100' },
  routePoint: { fontSize: 12, color: '#555', marginBottom: 2 },
});
