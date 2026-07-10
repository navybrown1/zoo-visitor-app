import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import { Image } from 'expo-image';
import * as Location from 'expo-location';
import { api } from '../services/api';
import type { Exhibit, LatLng, MapPayload } from '../types';
import type { RootTabParamList } from '../navigation/RootTabs';
import {
  ServiceFilterToggles,
  type ServiceFilters,
} from '../components/ServiceFilterToggles';
import { ParkMap } from '../components/ParkMap';
import { getExhibitImageSource } from '../data/exhibitImages';
import { useIsDesktop } from '../hooks/useIsDesktop';
import { colors, radii, spacing, typography } from '../theme';

const DEFAULT_REGION = {
  latitude: 40.7678,
  longitude: -73.9720,
};

type Props = {
  route: RouteProp<RootTabParamList, 'Map'>;
};

/**
 * F002 — Interactive illustrated park map with mock exhibit routing.
 * F010 — Restroom / accessibility / family service filter toggles.
 * Supports deep links from Home to a selected exhibit or guest service.
 */
export function MapScreen({ route }: Props) {
  const isDesktop = useIsDesktop();
  const handledExhibit = useRef<string | null>(null);
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
        const nextRoute = await api.getRoute(exhibit.id);
        setRouteCoords(nextRoute.coordinates);
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

  useEffect(() => {
    const exhibitId = route.params?.exhibitId;
    if (!mapData || !exhibitId || handledExhibit.current === exhibitId) return;
    const exhibit = mapData.exhibits.find((item) => item.id === exhibitId);
    if (!exhibit) return;
    handledExhibit.current = exhibitId;
    void routeToExhibit(exhibit);
  }, [mapData, route.params?.exhibitId, routeToExhibit]);

  useEffect(() => {
    const serviceType = route.params?.serviceType;
    if (!serviceType) return;
    setFilters({
      restroom: serviceType === 'restroom',
      accessibility: serviceType === 'accessibility',
      family: serviceType === 'family',
    });
  }, [route.params?.serviceType]);

  const clearRoute = () => {
    setRouteCoords([]);
    setSelectedExhibit(null);
    handledExhibit.current = null;
  };

  if (loading || !mapData) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading park map…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.toolbar, isDesktop && styles.toolbarDesktop]}>
        <ServiceFilterToggles filters={filters} onChange={setFilters} />
        {selectedExhibit && isDesktop ? (
          <View style={styles.routeBarDesktop}>
            <Text style={styles.routeText}>
              {routing ? 'Finding the best path…' : `Illustrated route to ${selectedExhibit.name}`}
            </Text>
            <Pressable onPress={clearRoute} hitSlop={8}>
              <Text style={styles.clearText}>Clear</Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      <ParkMap
        entrance={mapData.visitorEntrance}
        exhibits={mapData.exhibits}
        services={visibleServices}
        routeCoords={routeCoords}
        showsUserLocation={!!userLocation}
        onExhibitPress={routeToExhibit}
        selectedExhibitId={selectedExhibit?.id}
      />

      {!isDesktop ? (
        <View style={styles.footer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.exhibitRow}
          >
            {mapData.exhibits.map((ex) => {
              const active = selectedExhibit?.id === ex.id;
              return (
                <Pressable
                  key={ex.id}
                  onPress={() => routeToExhibit(ex)}
                  style={({ pressed }) => [
                    styles.thumbChip,
                    active && styles.thumbChipActive,
                    pressed && { opacity: 0.88 },
                  ]}
                >
                  {getExhibitImageSource(ex.id, ex.imageUrl) ? (
                    <Image
                      source={getExhibitImageSource(ex.id, ex.imageUrl)}
                      style={styles.thumb}
                      contentFit="cover"
                    />
                  ) : (
                    <View style={[styles.thumb, styles.thumbFallback]} />
                  )}
                  <Text
                    style={[styles.thumbLabel, active && styles.thumbLabelActive]}
                    numberOfLines={1}
                  >
                    {ex.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
          {selectedExhibit && (
            <View style={styles.routeBar}>
              <Text style={styles.routeText}>
                {routing ? 'Finding the best path…' : `Illustrated route to ${selectedExhibit.name}`}
              </Text>
              <Pressable onPress={clearRoute} hitSlop={8}>
                <Text style={styles.clearText}>Clear</Text>
              </Pressable>
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { ...typography.caption, marginTop: spacing.sm },
  toolbar: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  toolbarDesktop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: spacing.xl,
  },
  routeBarDesktop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  footer: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: spacing.md,
  },
  exhibitRow: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  thumbChip: {
    width: 104,
    alignItems: 'center',
    borderRadius: radii.md,
    padding: 6,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  thumbChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  thumb: {
    width: 88,
    height: 88,
    borderRadius: radii.sm,
    marginBottom: 6,
  },
  thumbFallback: { backgroundColor: colors.primaryLight },
  thumbLabel: {
    ...typography.caption,
    color: colors.text,
    textAlign: 'center',
    fontFamily: typography.label.fontFamily,
  },
  thumbLabelActive: { color: colors.primary },
  routeBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  routeText: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  clearText: {
    ...typography.label,
    color: colors.danger,
  },
});