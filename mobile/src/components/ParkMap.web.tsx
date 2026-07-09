import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image as RNImage,
  LayoutChangeEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import type { Exhibit, GuestService, LatLng } from '../types';
import { colors, radii, spacing, typography } from '../theme';
import { ExhibitPhoto } from './ExhibitPhoto';
import { getExhibitImageSource } from '../data/exhibitImages';
import { MAP_HOTSPOTS, SERVICE_HOTSPOTS } from '../data/mapHotspots';
import { useIsDesktop } from '../hooks/useIsDesktop';

const PARK_MAP = require('../../assets/map/park-map.png');
/** park-map.png is 1024×768 → 4:3 */
const MAP_ASPECT = 4 / 3;

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
 * Interactive illustrated park map — full artwork, tappable habitats, full animal photos.
 * Desktop: wide map + side habitat gallery. Mobile: stacked scroll.
 */
export function ParkMap({
  exhibits,
  services,
  routeCoords,
  onExhibitPress,
  selectedExhibitId,
}: Props) {
  const isDesktop = useIsDesktop();
  const [contentWidth, setContentWidth] = useState(0);
  const mapWidth = contentWidth > 0 ? contentWidth : 320;
  const mapHeight = Math.round(mapWidth / MAP_ASPECT);
  const hasRoute = routeCoords.length > 1;
  const selected = exhibits.find((e) => e.id === selectedExhibitId) ?? null;

  const onContentLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && Math.abs(w - contentWidth) > 1) {
      setContentWidth(w);
    }
  };

  const mapBlock = (
    <View style={styles.mapColumn} onLayout={onContentLayout}>
      <Text style={styles.hint}>Tap a habitat on the map to get directions</Text>

      {contentWidth > 0 ? (
        <View style={[styles.mapFrame, { width: mapWidth, height: mapHeight }]}>
          <RNImage
            source={PARK_MAP}
            style={{ width: mapWidth, height: mapHeight }}
            resizeMode="stretch"
            accessibilityLabel="Zoo park map"
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
                  <View style={styles.routeBadge}>
                    <Ionicons name="walk" size={14} color={colors.white} />
                    <Text style={styles.routeBadgeText}>Routing</Text>
                  </View>
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
                pointerEvents="none"
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
      ) : (
        <View style={styles.mapPlaceholder} />
      )}

      {selected && !isDesktop ? (
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 250 }}
          style={styles.selectedCard}
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
    </View>
  );

  const gallery = (
    <View style={[styles.gallery, isDesktop && styles.galleryDesktop]}>
      {selected && isDesktop ? (
        <MotiView
          from={{ opacity: 0, translateY: 8 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 250 }}
          style={styles.selectedCardDesktop}
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
            <Text style={styles.selectedTitleDesktop}>{selected.name}</Text>
            <Text style={styles.selectedBody}>{selected.description}</Text>
          </View>
        </MotiView>
      ) : null}

      <Text style={styles.section}>Habitats</Text>
      {exhibits.map((ex, index) => {
        const active = selectedExhibitId === ex.id;
        return (
          <MotiView
            key={ex.id}
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 280, delay: index * 40 }}
          >
            <Pressable
              onPress={() => onExhibitPress(ex)}
              style={({ pressed }) => [
                styles.exhibitCard,
                isDesktop && styles.exhibitCardDesktop,
                active && styles.exhibitCardSelected,
                pressed && { opacity: 0.94 },
              ]}
            >
              <ExhibitPhoto
                source={getExhibitImageSource(ex.id, ex.imageUrl)}
                style={isDesktop ? styles.exhibitPhotoDesktop : styles.exhibitPhoto}
              />
              <View style={styles.exhibitBody}>
                <View style={styles.exhibitTop}>
                  <View style={styles.exhibitText}>
                    <Text style={[styles.cardTitle, active && styles.cardTitleSelected]}>
                      {ex.name}
                    </Text>
                    <Text style={styles.category}>{ex.category}</Text>
                    {!isDesktop ? (
                      <Text style={styles.cardMeta}>{ex.description}</Text>
                    ) : null}
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
    </View>
  );

  if (isDesktop) {
    return (
      <View style={styles.desktopRoot}>
        <ScrollView
          style={styles.desktopMapPane}
          contentContainerStyle={styles.desktopMapContent}
        >
          {mapBlock}
        </ScrollView>
        <ScrollView
          style={styles.desktopSidePane}
          contentContainerStyle={styles.desktopSideContent}
        >
          {gallery}
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.column}>
        {mapBlock}
        {gallery}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  column: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  desktopRoot: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.background,
    minHeight: 0,
  },
  desktopMapPane: {
    flex: 1.55,
    minWidth: 0,
  },
  desktopMapContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  desktopSidePane: {
    flex: 1,
    maxWidth: 420,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    backgroundColor: colors.surface,
    minWidth: 300,
  },
  desktopSideContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  mapColumn: {
    width: '100%',
  },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  mapFrame: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.primaryLight,
    backgroundColor: '#E8F5E9',
    position: 'relative',
    maxWidth: '100%',
  },
  mapPlaceholder: {
    width: '100%',
    aspectRatio: MAP_ASPECT,
    borderRadius: radii.lg,
    backgroundColor: colors.primarySoft,
  },
  hotspot: {
    position: 'absolute',
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  hotspotActive: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(249, 168, 37, 0.2)',
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
  gallery: {
    width: '100%',
  },
  galleryDesktop: {
    width: '100%',
  },
  selectedCard: {
    marginTop: spacing.lg,
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  selectedCardDesktop: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: radii.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
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
  selectedTitleDesktop: {
    fontFamily: typography.display.fontFamily,
    fontSize: 22,
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
    marginTop: spacing.sm,
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
  exhibitCardDesktop: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: colors.background,
  },
  exhibitCardSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  exhibitPhoto: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 0,
  },
  exhibitPhotoDesktop: {
    width: 112,
    height: 84,
    borderRadius: 0,
  },
  exhibitBody: {
    padding: spacing.md,
    flex: 1,
    justifyContent: 'center',
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
