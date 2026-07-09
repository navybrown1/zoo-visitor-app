import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import * as Location from 'expo-location';
import { api } from '../services/api';
import type { Exhibit, LatLng, MapPayload } from '../types';
import {
  ServiceFilterToggles,
  type ServiceFilters,
} from '../components/ServiceFilterToggles';
import { ParkMap } from '../components/ParkMap';

const DEFAULT_REGION = {
  latitude: 40.7678,
  longitude: -73.9720,
};

/**
 * F002 — Interactive park map with mock exhibit routing.
 * F010 — Restroom / accessibility / family service filter toggles.
 */
export function MapScreen() {
  const [mapData, setMapData] = useState<MapPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ServiceFilters>({
    restroom: true,
    accessibility: true,
    family: true,
  });
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  const [selectedExhibit, setSelectedExhibit] = useState<Exhibit | null>(null);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [routing, setRouting] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await api.getMap();
        if (mounted) setMapData(data);
      } finally {
        if (mounted) setLoading(false);
      }

      if (Platform.OS !== 'web') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({});
          if (mounted) {
            setUserLocation({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            });
          }
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const visibleServices = (mapData?.services ?? []).filter((s) => filters[s.type]);

  const routeToExhibit = useCallback(
    async (exhibit: Exhibit) => {
      setSelectedExhibit(exhibit);
      setRouting(true);
      try {
        const route = await api.getRoute(exhibit.id);
        setRouteCoords(route.coordinates);
      } catch {
        const origin = mapData?.visitorEntrance ?? DEFAULT_REGION;
        setRouteCoords([
          origin,
          { latitude: exhibit.latitude, longitude: exhibit.longitude },
        ]);
      } finally {
        setRouting(false);
      }
    },
    [mapData],
  );

  const clearRoute = () => {
    setRouteCoords([]);
    setSelectedExhibit(null);
  };

  if (loading || !mapData) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1B5E20" />
        <Text style={styles.loadingText}>Loading park map…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ServiceFilterToggles filters={filters} onChange={setFilters} />

      <ParkMap
        entrance={mapData.visitorEntrance}
        exhibits={mapData.exhibits}
        services={visibleServices}
        routeCoords={routeCoords}
        showsUserLocation={!!userLocation}
        onExhibitPress={routeToExhibit}
      />

      <View style={styles.footer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.exhibitRow}
        >
          {mapData.exhibits.map((ex) => (
            <Pressable
              key={ex.id}
              style={[
                styles.exhibitChip,
                selectedExhibit?.id === ex.id && styles.exhibitChipActive,
              ]}
              onPress={() => routeToExhibit(ex)}
            >
              <Text
                style={[
                  styles.exhibitChipText,
                  selectedExhibit?.id === ex.id && styles.exhibitChipTextActive,
                ]}
              >
                {ex.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        {selectedExhibit && (
          <View style={styles.routeBar}>
            <Text style={styles.routeText}>
              {routing ? 'Calculating route…' : `Route to ${selectedExhibit.name}`}
            </Text>
            <Pressable onPress={clearRoute}>
              <Text style={styles.clearText}>Clear</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 8, color: '#666' },
  footer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 10,
  },
  exhibitRow: { paddingHorizontal: 12, gap: 8 },
  exhibitChip: {
    borderWidth: 1,
    borderColor: '#C8E6C9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  exhibitChipActive: { backgroundColor: '#1B5E20', borderColor: '#1B5E20' },
  exhibitChipText: { fontSize: 13, fontWeight: '600', color: '#1B5E20' },
  exhibitChipTextActive: { color: '#fff' },
  routeBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  routeText: { fontSize: 13, color: '#333', fontWeight: '600' },
  clearText: { fontSize: 13, color: '#C62828', fontWeight: '700' },
});
