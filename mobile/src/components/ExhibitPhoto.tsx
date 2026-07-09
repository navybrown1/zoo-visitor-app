import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii } from '../theme';

interface Props {
  uri?: string;
  style?: ViewStyle;
  /** Soft gradient scrim for text overlays */
  overlay?: boolean;
}

/** Zoo animal / habitat photo with graceful placeholder. */
export function ExhibitPhoto({ uri, style, overlay = false }: Props) {
  return (
    <View style={[styles.wrap, style]}>
      <Image
        source={uri ? { uri } : undefined}
        style={styles.image}
        contentFit="cover"
        transition={280}
        placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
        recyclingKey={uri}
      />
      {overlay ? (
        <LinearGradient
          colors={['transparent', 'rgba(13,59,18,0.75)']}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      {!uri ? <View style={styles.fallback} /> : null}
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
