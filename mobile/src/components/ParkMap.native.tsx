import React from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, Polyline, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Image } from 'expo-image';
import type { Exhibit, GuestService, LatLng } from '../types';
import { getExhibitImageSource } from '../data/exhibitImages';
import { colors, radii, typography } from '../theme';

const SERVICE_COLORS: Record<GuestService['type'], string> = {
  restroom: colors.service.restroom,
  accessibility: colors.service.accessibility,
  family: colors.service.family,
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

/** Native map with photo callouts for each habitat (F002 / F010). */
export function ParkMap({
  entrance,
  exhibits,
  services,
  routeCoords,
  showsUserLocation,
  onExhibitPress,
  selectedExhibitId,
}: Props) {
  return (
    <MapView
      style={styles.map}
      provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
      initialRegion={{
        ...entrance,
        latitudeDelta: 0.012,
        longitudeDelta: 0.012,
      }}
      showsUserLocation={showsUserLocation}
    >
      <Marker coordinate={entrance} title="Visitor Entrance" pinColor={colors.primary} />

      {exhibits.map((ex) => (
        <Marker
          key={ex.id}
          coordinate={{ latitude: ex.latitude, longitude: ex.longitude }}
          pinColor={selectedExhibitId === ex.id ? colors.primary : colors.accent}
          onPress={() => onExhibitPress(ex)}
        >
          {getExhibitImageSource(ex.id, ex.imageUrl) ? (
            <View
              style={[
                styles.photoMarker,
                selectedExhibitId === ex.id && styles.photoMarkerSelected,
              ]}
            >
              <Image
                source={getExhibitImageSource(ex.id, ex.imageUrl)}
                style={styles.markerImage}
                contentFit="cover"
              />
            </View>
          ) : null}
          <Callout onPress={() => onExhibitPress(ex)}>
            <View style={styles.callout}>
              {getExhibitImageSource(ex.id, ex.imageUrl) ? (
                <Image
                  source={getExhibitImageSource(ex.id, ex.imageUrl)}
                  style={styles.calloutImage}
                  contentFit="cover"
                />
              ) : null}
              <Text style={styles.calloutTitle}>{ex.name}</Text>
              <Text style={styles.calloutBody}>{ex.description}</Text>
            </View>
          </Callout>
        </Marker>
      ))}

      {services.map((svc) => (
        <Marker
          key={svc.id}
          coordinate={{ latitude: svc.latitude, longitude: svc.longitude }}
          title={svc.name}
          description={svc.type}
          pinColor={SERVICE_COLORS[svc.type]}
        />
      ))}

      {routeCoords.length > 1 && (
        <Polyline coordinates={routeCoords} strokeColor={colors.primary} strokeWidth={5} />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  photoMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: colors.primarySoft,
  },
  photoMarkerSelected: {
    borderColor: colors.accent,
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  markerImage: { width: '100%', height: '100%' },
  callout: { width: 180 },
  calloutImage: {
    width: '100%',
    height: 90,
    borderRadius: radii.sm,
    marginBottom: 6,
  },
  calloutTitle: {
    fontFamily: typography.section.fontFamily,
    fontSize: 14,
    color: colors.text,
  },
  calloutBody: {
    ...typography.caption,
    marginTop: 2,
  },
});
