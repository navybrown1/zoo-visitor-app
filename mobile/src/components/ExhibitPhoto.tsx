import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Image, type ImageSource } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii } from '../theme';

interface Props {
  source?: ImageSource;
  /** @deprecated prefer `source` — kept for simple remote-only callers */
  uri?: string;
  style?: ViewStyle;
  /** Soft gradient scrim for text overlays */
  overlay?: boolean;
}

/** Zoo animal / habitat photo with graceful placeholder. */
export function ExhibitPhoto({ source, uri, style, overlay = false }: Props) {
  const resolved = source ?? (uri ? { uri } : undefined);

  return (
    <View style={[styles.wrap, style]}>
      <Image
        source={resolved}
        style={styles.image}
        contentFit="cover"
        transition={280}
        placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
      />
      {overlay ? (
        <LinearGradient
          colors={['transparent', 'rgba(13,59,18,0.75)']}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      {!resolved ? <View style={styles.fallback} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.md,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.primaryLight,
  },
});
