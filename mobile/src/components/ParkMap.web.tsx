import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import type { Exhibit, GuestService, LatLng } from '../types';
import { colors, radii, spacing, typography } from '../theme';
import { ExhibitPhoto } from './ExhibitPhoto';
import { getExhibitImageSource } from '../data/exhibitImages';
import { MAP_HOTSPOTS, SERVICE_HOTSPOTS } from '../data/mapHotspots';

const PARK_MAP = require('../../assets/map/park-map.png');
/** park-map.png is 1024×768 */
const MAP_ASPECT = 768 / 1024;

const SERVICE_COLORS: Record<GuestService['type'], string> = {
  restroom: colors.service.restroom,
  accessibility: colors.service.accessibility,
  family: colors.service.family,
};

const SERVICE_ICONS: Record<GuestService['type'], keyof typeof Ionicons.glyphMap> = {
  restroom: 'water',
  accessibility: 'body',
  family: 'people',
};

interface Props {
  entrance: LatLng;
  exhibits: Exhibit[];
  services: GuestService[];
  routeCoords: LatLng[];
  showsUserLocation: boolean;
  onExhibitPress: (exhibit: Exhibit) => void;
  selectedExhibitId?: string | null;
}

/**
 * Interactive illustrated park map — visitor-facing map experience.
 * Full park artwork with tappable habitat zones + uncropped habitat photos.
 */
export function ParkMap({
  exhibits,
  services,
  routeCoords,
  onExhibitPress,
  selectedExhibitId,
}: Props) {
  const { width: windowWidth } = useWindowDimensions();
  const mapWidth = Math.min(windowWidth - spacing.md * 2, 900);
  const mapHeight = mapWidth * MAP_ASPECT;
  const hasRoute = routeCoords.length > 1;
  const selected = exhibits.find((e) => e.id === selectedExhibitId) ?? null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.hint}>Tap a habitat on the map to get directions</Text>

      <View style={[styles.mapFrame, { width: mapWidth, height: mapHeight }]}>
        <Image
          source={PARK_MAP}
          style={{ width: mapWidth, height: mapHeight }}
          contentFit="fill"
        />

        {exhibits.map((ex) => {
          const spot = MAP_HOTSPOTS[ex.id];
          if (!spot) return null;
          const active = selectedExhibitId === ex.id;
          return (
            <Pressable
              key={ex.id}
              accessibilityRole="button"
              accessibilityLabel={`Route to ${ex.name}`}
              onPress={() => onExhibitPress(ex)}
              style={[
                styles.hotspot,
                {
                  top: spot.top,
                  left: spot.left,
                  width: spot.width,
                  height: spot.height,
                },
                active && styles.hotspotActive,
              ]}
            >
              {active ? (
                <MotiView
                  from={{ scale: 0.9, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={styles.routeBadge}
                >
                  <Ionicons name="walk" size={14} color={colors.white} />
                  <Text style={styles.routeBadgeText}>Routing</Text>
                </MotiView>
              ) : null}
            </Pressable>
          );
        })}

        {services.map((svc) => {
          const spot = SERVICE_HOTSPOTS[svc.id];
          if (!spot) return null;
          return (
            <View
              key={svc.id}
              style={[
                styles.servicePin,
                {
                  top: spot.top,
                  left: spot.left,
                  backgroundColor: SERVICE_COLORS[svc.type],
                },
              ]}
            >
              <Ionicons name={SERVICE_ICONS[svc.type]} size={12} color={colors.white} />
            </View>
          );
        })}
      </View>

      {selected ? (
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 250 }}
          style={[styles.selectedCard, { width: mapWidth }]}
        >
          <ExhibitPhoto
            source={getExhibitImageSource(selected.id, selected.imageUrl)}
            style={styles.selectedPhoto}
            overlay
          />
          <View style={styles.selectedCopy}>
            <Text style={styles.selectedEyebrow}>
              {hasRoute ? 'Walking route ready' : 'Selected habitat'}
            </Text>
            <Text style={styles.selectedTitle}>{selected.name}</Text>
            <Text style={styles.selectedBody}>{selected.description}</Text>
          </View>
        </MotiView>
      ) : null}

      <Text style={[styles.section, { width: mapWidth }]}>Habitats</Text>
      {exhibits.map((ex, index) => {
        const active = selectedExhibitId === ex.id;
        return (
          <MotiView
            key={ex.id}
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 280, delay: index * 40 }}
            style={{ width: mapWidth }}
          >
            <Pressable
              onPress={() => onExhibitPress(ex)}
              style={({ pressed }) => [
                styles.exhibitCard,
                active && styles.exhibitCardSelected,
                pressed && { opacity: 0.94 },
              ]}
            >
              <ExhibitPhoto
                source={getExhibitImageSource(ex.id, ex.imageUrl)}
                style={styles.exhibitPhoto}
              />
              <View style={styles.exhibitBody}>
                <View style={styles.exhibitTop}>
                  <View style={styles.exhibitText}>
                    <Text style={[styles.cardTitle, active && styles.cardTitleSelected]}>
                      {ex.name}
                    </Text>
                    <Text style={styles.category}>{ex.category}</Text>
                    <Text style={styles.cardMeta}>{ex.description}</Text>
                  </View>
                  <Ionicons
                    name={active ? 'walk' : 'chevron-forward'}
                    size={20}
                    color={active ? colors.primary : colors.textMuted}
                  />
                </View>
              </View>
            </Pressable>
          </MotiView>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    alignSelf: 'stretch',
    marginBottom: spacing.sm,
  },
  mapFrame: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.primaryLight,
    backgroundColor: colors.primarySoft,
    position: 'relative',
  },
  hotspot: {
    position: 'absolute',
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  hotspotActive: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(249, 168, 37, 0.18)',
  },
  routeBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  routeBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontFamily: typography.label.fontFamily,
  },
  servicePin: {
    position: 'absolute',
    width: 26,
    height: 26,
    marginLeft: -13,
    marginTop: -13,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  selectedCard: {
    marginTop: spacing.lg,
    aspectRatio: 4 / 3,
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  selectedPhoto: {
    ...StyleSheet.absoluteFill,
    borderRadius: radii.lg,
  },
  selectedCopy: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
  },
  selectedEyebrow: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.9)',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  selectedTitle: {
    fontFamily: typography.display.fontFamily,
    fontSize: 26,
    color: colors.white,
    marginTop: 2,
  },
  selectedBody: {
    ...typography.body,
    color: 'rgba(255,255,255,0.92)',
    marginTop: 4,
  },
  section: {
    ...typography.section,
    color: colors.primary,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  exhibitCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  exhibitCardSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  /** Match 1024×768 animal photos so cover does not slice faces */
  exhibitPhoto: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 0,
  },
  exhibitBody: {
    padding: spacing.md,
  },
  exhibitTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  exhibitText: { flex: 1 },
  cardTitle: {
    fontFamily: typography.section.fontFamily,
    fontSize: 17,
    color: colors.text,
  },
  cardTitleSelected: { color: colors.primary },
  category: {
    ...typography.caption,
    color: colors.primary,
    textTransform: 'capitalize',
    marginTop: 2,
  },
  cardMeta: {
    ...typography.caption,
    marginTop: 4,
  },
});
