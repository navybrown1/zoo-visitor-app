import React, { useCallback, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  RefreshControl,
  View,
  Text,
  Pressable,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Image } from 'expo-image';
import { MotiView } from 'moti';
import { api } from '../services/api';
import type { Exhibit, ParkingLot, WeatherAlert } from '../types';
import type { RootTabParamList } from '../navigation/RootTabs';
import { WeatherBanner } from '../components/WeatherBanner';
import { ParkingWidget } from '../components/ParkingWidget';
import { NotificationListener } from '../components/NotificationListener';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { PageContainer } from '../components/ui/PageContainer';
import { getExhibitImageSource } from '../data/exhibitImages';
import { useIsDesktop } from '../hooks/useIsDesktop';
import { colors, radii, spacing, typography } from '../theme';

/**
 * Dashboard aggregates:
 * F009 — parking availability
 * F014 — weather / heat safety banner
 * F006 — safety notification listener
 * Plus a photo strip of habitats for atmosphere.
 */
export function DashboardScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const isDesktop = useIsDesktop();
  const [lots, setLots] = useState<ParkingLot[]>([]);
  const [weather, setWeather] = useState<WeatherAlert | null>(null);
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const [parking, wx, map] = await Promise.all([
        api.getParking(),
        api.getWeather(),
        api.getMap(),
      ]);
      setLots(parking);
      setWeather(wx);
      setExhibits(map.exhibits);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const subtitle =
    weather?.alertLevel && weather.alertLevel !== 'none'
      ? `Heat advisory active · ${weather.tempF}°F`
      : 'Parking · Weather · Safety';

  return (
    <PageContainer>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={load} tintColor={colors.primary} />
        }
      >
        <ScreenHeader title="Visitor Dashboard" subtitle={subtitle} />

        {exhibits.length > 0 ? (
          <View style={styles.stripSection}>
            <Text style={styles.stripTitle}>Today at the zoo</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.strip}
            >
              {exhibits.map((ex, index) => (
                <MotiView
                  key={ex.id}
                  from={{ opacity: 0, translateX: 12 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ type: 'timing', duration: 300, delay: index * 50 }}
                >
                  <Pressable
                    style={[styles.stripCard, isDesktop && styles.stripCardDesktop]}
                    onPress={() => navigation.navigate('Map')}
                  >
                    <Image
                      source={getExhibitImageSource(ex.id, ex.imageUrl)}
                      style={styles.stripImage}
                      contentFit="cover"
                      transition={250}
                    />
                    <View style={styles.stripLabelWrap}>
                      <Text style={styles.stripLabel} numberOfLines={1}>
                        {ex.name}
                      </Text>
                    </View>
                  </Pressable>
                </MotiView>
              ))}
            </ScrollView>
          </View>
        ) : null}

        <View style={isDesktop ? styles.desktopGrid : undefined}>
          <View style={isDesktop ? styles.desktopCol : undefined}>
            <WeatherBanner weather={weather} />
            <NotificationListener />
          </View>
          <View style={isDesktop ? styles.desktopCol : undefined}>
            <ParkingWidget lots={lots} />
          </View>
        </View>
      </ScrollView>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 24 },
  stripSection: {
    marginTop: spacing.sm,
  },
  stripTitle: {
    ...typography.section,
    color: colors.primary,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  strip: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  stripCard: {
    width: 168,
    aspectRatio: 4 / 3,
    borderRadius: radii.md,
    overflow: 'hidden',
    backgroundColor: colors.primarySoft,
  },
  stripCardDesktop: {
    width: 220,
  },
  stripImage: {
    width: '100%',
    height: '100%',
  },
  stripLabelWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    backgroundColor: 'rgba(13,59,18,0.72)',
  },
  stripLabel: {
    ...typography.caption,
    color: colors.white,
    fontFamily: typography.label.fontFamily,
  },
  desktopGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  desktopCol: {
    flex: 1,
    minWidth: 0,
  },
});
