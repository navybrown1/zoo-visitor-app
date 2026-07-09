import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import type { Exhibit, GuestService, LatLng } from '../types';
import { colors, radii, spacing, typography } from '../theme';
import { Card } from './ui/Card';
import { ExhibitPhoto } from './ExhibitPhoto';

const SERVICE_COLORS: Record<GuestService['type'], string> = {
  restroom: colors.service.restroom,
  accessibility: colors.service.accessibility,
  family: colors.service.family,
};

const SERVICE_ICONS: Record<GuestService['type'], keyof typeof Ionicons.glyphMap> = {
  restroom: 'water-outline',
  accessibility: 'body-outline',
  family: 'people-outline',
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
 * Web park map — photo-forward exhibit cards (no native MapView on web).
 */
export function ParkMap({
  entrance,
  exhibits,
  services,
  routeCoords,
  onExhibitPress,
  selectedExhibitId,
}: Props) {
  const hasRoute = routeCoords.length > 1;
  const selected = exhibits.find((e) => e.id === selectedExhibitId) ?? null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {selected?.imageUrl ? (
        <MotiView
          from={{ opacity: 0.6, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 280 }}
          style={styles.featured}
        >
          <ExhibitPhoto uri={selected.imageUrl} style={styles.featuredPhoto} overlay />
          <View style={styles.featuredCopy}>
            <Text style={styles.featuredEyebrow}>Now routing</Text>
            <Text style={styles.featuredTitle}>{selected.name}</Text>
            <Text style={styles.featuredBody}>{selected.description}</Text>
          </View>
        </MotiView>
      ) : (
        <Card style={styles.hero}>
          <View style={styles.heroRow}>
            <View style={styles.heroIcon}>
              <Ionicons name="paw" size={22} color={colors.white} />
            </View>
            <View style={styles.heroCopy}>
              <Text style={styles.heroTitle}>Meet the animals</Text>
              <Text style={styles.heroBody}>
                Tap a habitat photo to preview a walking route from the visitor entrance.
              </Text>
            </View>
          </View>
          <Text style={styles.entrance}>
            Entrance · {entrance.latitude.toFixed(4)}, {entrance.longitude.toFixed(4)}
          </Text>
        </Card>
      )}

      <Text style={styles.section}>Habitats</Text>
      {exhibits.map((ex, index) => {
        const isSelected = selectedExhibitId === ex.id;
        return (
          <MotiView
            key={ex.id}
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 280, delay: index * 45 }}
          >
            <Pressable
              onPress={() => onExhibitPress(ex)}
              style={({ pressed }) => [
                styles.exhibitCard,
                isSelected && styles.exhibitCardSelected,
                pressed && { opacity: 0.92 },
              ]}
            >
              <ExhibitPhoto uri={ex.imageUrl} style={styles.exhibitPhoto} />
              <View style={styles.exhibitBody}>
                <View style={styles.exhibitTop}>
                  <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
                    {ex.name}
                  </Text>
                  <Ionicons
                    name={isSelected ? 'walk' : 'chevron-forward'}
                    size={18}
                    color={isSelected ? colors.primary : colors.textMuted}
                  />
                </View>
                <Text style={styles.category}>{ex.category}</Text>
                <Text style={styles.cardMeta}>{ex.description}</Text>
              </View>
            </Pressable>
          </MotiView>
        );
      })}

      <Text style={styles.section}>Guest services</Text>
      {services.map((svc) => (
        <Card key={svc.id} accentBorder={SERVICE_COLORS[svc.type]} style={styles.serviceCard}>
          <View style={styles.serviceRow}>
            <Ionicons name={SERVICE_ICONS[svc.type]} size={18} color={SERVICE_COLORS[svc.type]} />
            <View style={styles.serviceCopy}>
              <Text style={styles.cardTitle}>{svc.name}</Text>
              <Text style={styles.cardMeta}>{svc.type}</Text>
            </View>
          </View>
        </Card>
      ))}

      {hasRoute ? (
        <MotiView
          from={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 250 }}
          style={styles.routeBox}
        >
          <View style={styles.routeHeader}>
            <Ionicons name="git-commit-outline" size={18} color={colors.warning} />
            <Text style={styles.routeTitle}>Suggested walking path</Text>
          </View>
          <Text style={styles.routeHint}>
            Follow the path from the entrance to your selected exhibit.
          </Text>
          {routeCoords.map((c, i) => (
            <View key={`${c.latitude}-${i}`} style={styles.routeStep}>
              <View style={styles.stepDot}>
                <Text style={styles.stepNum}>{i + 1}</Text>
              </View>
              <Text style={styles.routePoint}>
                {i === 0
                  ? 'Start at visitor entrance'
                  : i === routeCoords.length - 1
                    ? `Arrive at ${selected?.name ?? 'exhibit'}`
                    : 'Continue along the path'}
              </Text>
            </View>
          ))}
        </MotiView>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  featured: {
    height: 210,
    borderRadius: radii.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  featuredPhoto: {
    ...StyleSheet.absoluteFill,
    borderRadius: radii.lg,
  },
  featuredCopy: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
  },
  featuredEyebrow: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.85)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  featuredTitle: {
    fontFamily: typography.display.fontFamily,
    fontSize: 26,
    color: colors.white,
    marginTop: 2,
  },
  featuredBody: {
    ...typography.body,
    color: 'rgba(255,255,255,0.92)',
    marginTop: 4,
  },
  hero: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
    marginBottom: spacing.md,
  },
  heroRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCopy: { flex: 1 },
  heroTitle: {
    fontFamily: typography.section.fontFamily,
    fontSize: 17,
    color: colors.white,
  },
  heroBody: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  entrance: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.75)',
    marginTop: spacing.md,
  },
  section: {
    ...typography.section,
    color: colors.primary,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  exhibitCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  exhibitCardSelected: {
    borderColor: colors.primary,
  },
  exhibitPhoto: {
    height: 150,
    borderRadius: 0,
  },
  exhibitBody: {
    padding: spacing.md,
  },
  exhibitTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    ...typography.bodyMedium,
    fontFamily: typography.section.fontFamily,
    fontSize: 16,
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
  serviceCard: {
    marginBottom: spacing.sm,
    paddingVertical: spacing.md,
  },
  serviceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  serviceCopy: { flex: 1 },
  routeBox: {
    marginTop: spacing.md,
    backgroundColor: colors.warningSoft,
    borderRadius: radii.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  routeTitle: {
    fontFamily: typography.section.fontFamily,
    color: colors.warning,
    fontSize: 15,
  },
  routeHint: {
    ...typography.caption,
    marginBottom: spacing.md,
  },
  routeStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  stepDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: {
    color: colors.white,
    fontSize: 11,
    fontFamily: typography.label.fontFamily,
  },
  routePoint: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
});
