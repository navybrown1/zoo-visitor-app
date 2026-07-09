import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../services/api';
import type { ParkingLot, WeatherAlert } from '../types';
import { WeatherBanner } from '../components/WeatherBanner';
import { ParkingWidget } from '../components/ParkingWidget';
import { NotificationListener } from '../components/NotificationListener';

/**
 * Dashboard aggregates:
 * F009 — parking availability
 * F014 — weather / heat safety banner
 * F006 — safety notification listener
 */
export function DashboardScreen() {
  const [lots, setLots] = useState<ParkingLot[]>([]);
  const [weather, setWeather] = useState<WeatherAlert | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const [parking, wx] = await Promise.all([api.getParking(), api.getWeather()]);
      setLots(parking);
      setWeather(wx);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Visitor Dashboard</Text>
        <Text style={styles.subtitle}>Parking · Weather · Safety</Text>
      </View>

      <WeatherBanner weather={weather} />
      <ParkingWidget lots={lots} />
      <NotificationListener />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  content: { paddingBottom: 24 },
  header: { paddingHorizontal: 16, paddingTop: 12 },
  title: { fontSize: 22, fontWeight: '800', color: '#1B5E20' },
  subtitle: { fontSize: 13, color: '#666', marginTop: 2 },
});
