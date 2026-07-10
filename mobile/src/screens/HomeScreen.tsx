import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { api } from '../services/api';
import type { Exhibit, ParkingLot, WeatherAlert } from '../types';
import type { RootTabParamList } from '../navigation/RootTabs';
import { getExhibitImageSource } from '../data/exhibitImages';
import { WeatherBanner } from '../components/WeatherBanner';
import { ParkingWidget } from '../components/ParkingWidget';
import { NotificationListener } from '../components/NotificationListener';
import { PageContainer } from '../components/ui/PageContainer';
import { useIsDesktop } from '../hooks/useIsDesktop';
import { colors, radii, spacing, typography } from '../theme';

const HERO_IMAGE = require('../../assets/exhibits/lions.png');

const SAMPLE_HIGHLIGHTS = [
  { time: '10:30 AM', title: 'Penguin feeding', location: 'Penguin Coast', icon: 'fish-outline' },
  { time: '12:00 PM', title: 'Lion keeper talk', location: 'Lion Habitat', icon: 'mic-outline' },
  { time: '2:15 PM', title: 'Reptile encounter', location: 'Reptile House', icon: 'paw-outline' },
] as const;

export function HomeScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const isDesktop = useIsDesktop();
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);
  const [lots, setLots] = useState<ParkingLot[]>([]);
  const [weather, setWeather] = useState<WeatherAlert | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const [map, parking, currentWeather] = await Promise.all([
        api.getMap(),
        api.getParking(),
        api.getWeather(),
      ]);
      setExhibits(map.exhibits);
      setLots(parking);
      setWeather(currentWeather);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const quickActions = useMemo(
    () => [
      {
        label: 'Park Map',
        caption: 'Find animals and routes',
        icon: 'map-outline' as const,
        onPress: () => navigation.navigate('Map'),
      },
      {
        label: 'My Tickets',
        caption: 'Buy or open your passes',
        icon: 'ticket-outline' as const,
        onPress: () => navigation.navigate('Tickets'),
      },
      {
        label: 'Restrooms',
        caption: 'Locate the nearest facility',
        icon: 'water-outline' as const,
        onPress: () => navigation.navigate('Map', { serviceType: 'restroom' }),
      },
      {
        label: 'Accessibility',
        caption: 'Accessible services and routes',
        icon: 'accessibility-outline' as const,
        onPress: () => navigation.navigate('Map', { serviceType: 'accessibility' }),
      },
    ],
    [navigation],
  );

  return (
    <PageContainer maxWidth={1180}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={load} tintColor={colors.primary} />
        }
      >
        <View style={[styles.hero, isDesktop && styles.heroDesktop]}>
          <Image source={HERO_IMAGE} style={StyleSheet.absoluteFill} contentFit="cover" />
          <LinearGradient
            colors={['rgba(6,27,10,0.16)', 'rgba(6,27,10,0.92)']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.heroCopy, isDesktop && styles.heroCopyDesktop]}>
            <View style={styles.prototypePill}>
              <Ionicons name="leaf-outline" size={14} color={colors.white} />
              <Text style={styles.prototypeText}>Zoo visitor experience</Text>
            </View>
            <Text style={[styles.heroTitle, isDesktop && styles.heroTitleDesktop]}>
              Your wild day starts here.
            </Text>
            <Text style={[styles.heroBody, isDesktop && styles.heroBodyDesktop]}>
              Discover animals, plan your route, keep your tickets close, and make every stop count.
            </Text>
            <View style={[styles.heroActions, isDesktop && styles.heroActionsDesktop]}>
              <Pressable
                accessibilityRole="button"
                onPress={() => navigation.navigate('Map')}
                style={({ pressed }) => [styles.primaryAction, pressed && styles.pressed]}
              >
                <Ionicons name="navigate" size={19} color={colors.primaryDark} />
                <Text style={styles.primaryActionText}>Plan my day</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => navigation.navigate('Tickets')}
                style={({ pressed }) => [styles.secondaryAction, pressed && styles.pressed]}
              >
                <Ionicons name="ticket-outline" size={19} color={colors.white} />
                <Text style={styles.secondaryActionText}>Buy tickets</Text>
              </Pressable>
            </View>
            <Text style={styles.sampleNote}>Hours and event times shown in this prototype are sample data.</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.eyebrow}>PLAN YOUR VISIT</Text>
            <Text style={styles.sectionTitle}>Everything you need, one tap away</Text>
          </View>
        </View>

        <View style={[styles.quickGrid, isDesktop && styles.quickGridDesktop]}>
          {quickActions.map((action, index) => (
            <MotiView
              key={action.label}
              from={{ opacity: 0, translateY: 12 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 280, delay: index * 55 }}
              style={[styles.quickCell, isDesktop && styles.quickCellDesktop]}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={action.label}
                onPress={action.onPress}
                style={({ pressed }) => [styles.quickCard, pressed && styles.pressedCard]}
              >
                <View style={styles.quickIcon}>
                  <Ionicons name={action.icon} size={24} color={colors.primary} />
                </View>
                <View style={styles.quickCopy}>
                  <Text style={styles.quickTitle}>{action.label}</Text>
                  <Text style={styles.quickCaption}>{action.caption}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
              </Pressable>
            </MotiView>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.eyebrow}>SAMPLE SCHEDULE</Text>
            <Text style={styles.sectionTitle}>Happening today</Text>
          </View>
        </View>

        <View style={[styles.highlights, isDesktop && styles.highlightsDesktop]}>
          {SAMPLE_HIGHLIGHTS.map((item) => (
            <View key={`${item.time}-${item.title}`} style={styles.highlightCard}>
              <View style={styles.highlightIcon}>
                <Ionicons name={item.icon} size={22} color={colors.accent} />
              </View>
              <Text style={styles.highlightTime}>{item.time}</Text>
              <Text style={styles.highlightTitle}>{item.title}</Text>
              <Text style={styles.highlightLocation}>{item.location}</Text>
            </View>
          ))}
        </View>

        {exhibits.length > 0 ? (
          <View style={styles.exploreSection}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.eyebrow}>EXPLORE</Text>
                <Text style={styles.sectionTitle}>Meet the animals</Text>
              </View>
              <Pressable onPress={() => navigation.navigate('Map')} hitSlop={8}>
                <Text style={styles.seeAll}>See map</Text>
              </Pressable>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.animalRow}
            >
              {exhibits.map((exhibit, index) => (
                <MotiView
                  key={exhibit.id}
                  from={{ opacity: 0, translateX: 16 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ type: 'timing', duration: 300, delay: index * 45 }}
                >
                  <Pressable
                    onPress={() => navigation.navigate('Map', { exhibitId: exhibit.id })}
                    style={({ pressed }) => [styles.animalCard, pressed && styles.pressedCard]}
                  >
                    <Image
                      source={getExhibitImageSource(exhibit.id, exhibit.imageUrl)}
                      style={styles.animalImage}
                      contentFit="cover"
                      transition={200}
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(5,24,9,0.86)']}
                      style={StyleSheet.absoluteFill}
                    />
                    <View style={styles.animalCopy}>
                      <Text style={styles.animalCategory}>{exhibit.category}</Text>
                      <Text style={styles.animalName}>{exhibit.name}</Text>
                      <View style={styles.routeHint}>
                        <Ionicons name="walk-outline" size={14} color={colors.white} />
                        <Text style={styles.routeHintText}>View and route</Text>
                      </View>
                    </View>
                  </Pressable>
                </MotiView>
              ))}
            </ScrollView>
          </View>
        ) : null}

        {weather ? <WeatherBanner weather={weather} /> : null}

        {!weather ? (
          <View style={styles.offlineNotice}>
            <Ionicons name="cloud-offline-outline" size={20} color={colors.textSecondary} />
            <View style={styles.offlineCopy}>
              <Text style={styles.offlineTitle}>Live weather unavailable</Text>
              <Text style={styles.offlineBody}>No simulated warning is being shown. Pull down to try again.</Text>
            </View>
          </View>
        ) : null}

        <View style={isDesktop ? styles.statusGrid : undefined}>
          <View style={isDesktop ? styles.statusColumn : undefined}>
            <ParkingWidget lots={lots} />
          </View>
          <View style={isDesktop ? styles.statusColumn : undefined}>
            <NotificationListener />
          </View>
        </View>
      </ScrollView>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xxl },
  hero: {
    minHeight: 520,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    backgroundColor: colors.primaryDark,
  },
  heroDesktop: {
    minHeight: 590,
    margin: spacing.xl,
    borderRadius: radii.xl,
  },
  heroCopy: {
    paddingHorizontal: spacing.xl,
    paddingTop: 120,
    paddingBottom: spacing.xxl,
  },
  heroCopyDesktop: {
    maxWidth: 720,
    paddingHorizontal: 52,
    paddingBottom: 52,
  },
  prototypePill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    marginBottom: spacing.lg,
  },
  prototypeText: {
    ...typography.caption,
    color: colors.white,
    fontFamily: typography.label.fontFamily,
  },
  heroTitle: {
    fontFamily: typography.display.fontFamily,
    fontSize: 42,
    lineHeight: 46,
    color: colors.white,
    maxWidth: 650,
  },
  heroTitleDesktop: { fontSize: 62, lineHeight: 66 },
  heroBody: {
    ...typography.body,
    color: 'rgba(255,255,255,0.9)',
    fontSize: 17,
    lineHeight: 25,
    maxWidth: 620,
    marginTop: spacing.md,
  },
  heroBodyDesktop: { fontSize: 19, lineHeight: 28 },
  heroActions: { gap: spacing.md, marginTop: spacing.xl },
  heroActionsDesktop: { flexDirection: 'row' },
  primaryAction: {
    minHeight: 52,
    borderRadius: radii.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.accent,
  },
  primaryActionText: { ...typography.button, color: colors.primaryDark },
  secondaryAction: {
    minHeight: 52,
    borderRadius: radii.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
  },
  secondaryActionText: { ...typography.button, color: colors.white },
  sampleNote: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.7)',
    marginTop: spacing.md,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.985 }] },
  pressedCard: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: spacing.md,
  },
  eyebrow: {
    ...typography.caption,
    color: colors.primary,
    fontFamily: typography.label.fontFamily,
    letterSpacing: 1.1,
  },
  sectionTitle: {
    fontFamily: typography.display.fontFamily,
    fontSize: 27,
    color: colors.text,
    marginTop: 2,
  },
  quickGrid: { paddingHorizontal: spacing.lg, gap: spacing.md },
  quickGridDesktop: { flexDirection: 'row', flexWrap: 'wrap' },
  quickCell: { width: '100%' },
  quickCellDesktop: { width: '48.8%' },
  quickCard: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
    marginRight: spacing.md,
  },
  quickCopy: { flex: 1 },
  quickTitle: { ...typography.bodyMedium, color: colors.text, fontSize: 16 },
  quickCaption: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  highlights: { paddingHorizontal: spacing.lg, gap: spacing.md },
  highlightsDesktop: { flexDirection: 'row' },
  highlightCard: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: colors.primaryDark,
    minHeight: 178,
  },
  highlightIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(249,168,37,0.16)',
    marginBottom: spacing.lg,
  },
  highlightTime: { ...typography.caption, color: colors.accent, fontFamily: typography.label.fontFamily },
  highlightTitle: { ...typography.section, color: colors.white, marginTop: 4 },
  highlightLocation: { ...typography.caption, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  exploreSection: { marginTop: spacing.sm },
  seeAll: { ...typography.label, color: colors.primary },
  animalRow: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm, gap: spacing.md },
  animalCard: {
    width: 250,
    height: 315,
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: colors.primarySoft,
  },
  animalImage: { ...StyleSheet.absoluteFillObject },
  animalCopy: { position: 'absolute', left: spacing.lg, right: spacing.lg, bottom: spacing.lg },
  animalCategory: {
    ...typography.caption,
    color: colors.accent,
    textTransform: 'uppercase',
    fontFamily: typography.label.fontFamily,
    letterSpacing: 0.7,
  },
  animalName: {
    fontFamily: typography.display.fontFamily,
    fontSize: 25,
    color: colors.white,
    marginTop: 2,
  },
  routeHint: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: spacing.sm },
  routeHintText: { ...typography.caption, color: colors.white },
  offlineNotice: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  offlineCopy: { flex: 1 },
  offlineTitle: { ...typography.bodyMedium, color: colors.text },
  offlineBody: { ...typography.caption, color: colors.textSecondary, marginTop: 3 },
  statusGrid: { flexDirection: 'row', alignItems: 'flex-start' },
  statusColumn: { flex: 1, minWidth: 0 },
});