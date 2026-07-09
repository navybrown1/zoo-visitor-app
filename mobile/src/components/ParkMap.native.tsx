import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import type { Exhibit, GuestService, LatLng } from '../types';

const SERVICE_COLORS: Record<GuestService['type'], string> = {
  restroom: '#1565C0',
  accessibility: '#6A1B9A',
  family: '#E65100',
};

interface Props {
  entrance: LatLng;
  exhibits: Exhibit[];
  services: GuestService[];
  routeCoords: LatLng[];
  showsUserLocation: boolean;
  onExhibitPress: (exhibit: Exhibit) => void;
}

/** Native map powered by react-native-maps (F002 / F010). */
export function ParkMap({
  entrance,
  exhibits,
  services,
  routeCoords,
  showsUserLocation,
  onExhibitPress,
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
      <Marker coordinate={entrance} title="Visitor Entrance" pinColor="#1B5E20" />

      {exhibits.map((ex) => (
        <Marker
          key={ex.id}
          coordinate={{ latitude: ex.latitude, longitude: ex.longitude }}
          title={ex.name}
          description={ex.description}
          pinColor="#F9A825"
          onCalloutPress={() => onExhibitPress(ex)}
          onPress={() => onExhibitPress(ex)}
        />
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
        <Polyline coordinates={routeCoords} strokeColor="#1B5E20" strokeWidth={4} />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
});
