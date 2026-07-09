import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Image, type ImageSource } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii } from '../theme';

interface Props {
  source?: ImageSource;
  uri?: string;
  style?: ViewStyle;
  overlay?: boolean;
}

/**
 * Zoo animal / habitat photo.
 * Image is absolutely positioned so web always fills the 4:3 frame (no half-width crop).
 */
export function ExhibitPhoto({ source, uri, style, overlay = false }: Props) {
  const resolved = source ?? (uri ? { uri } : undefined);

  return (
    <View style={[styles.wrap, style]}>
      {resolved ? (
        <Image
          source={resolved}
          style={styles.image}
          contentFit="cover"
          transition={280}
        />
      ) : (
        <View style={styles.fallback} />
      )}
      {overlay ? (
        <LinearGradient
          colors={['transparent', 'rgba(13,59,18,0.75)']}
          style={styles.overlay}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.md,
    position: 'relative',
  },
  image: {
    ...StyleSheet.absoluteFill,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
  },
  fallback: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.primaryLight,
  },
});
