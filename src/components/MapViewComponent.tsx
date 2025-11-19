import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import MapView, {
  MapPressEvent,
  MapViewProps,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import { useTheme } from 'react-native-paper';
import { PERMISSIONS, request } from 'react-native-permissions';
import defaultPositions from '../settings/positions';
import MarkerComponent, { MarkerComponentProps } from './MarkerComponent';

export default function MapViewComponent(props: MapViewProps) {
  const theme = useTheme();
  const mapScale = 4;
  const mapRef = useRef<MapView | null>(null);
  const [markers, setMarkers] = useState<MarkerComponentProps[]>([]);
  const initialRegion = {
    latitude: -24.0438,
    longitude: -52.3811,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  useEffect(() => {
    request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
      console.log('Location permission result:', result);
      setUserCurrentLocationOnMap();
    });

    setMarkers([
      {
        id: 'initial_marker',
        coordinate: {
          latitude: -24.0438,
          longitude: -52.3811,
        },
        title: 'Bem-vindo!',
        description: 'Este é o ponto inicial do mapa.',
      },
    ]);
  }, []);

  function setUserCurrentLocationOnMap() {
    Location.getCurrentPositionAsync({}).then(location => {
      if (location) {
        mapRef.current?.animateToRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922 / mapScale,
          longitudeDelta: 0.0421 / mapScale,
        });
      }
    });
  }

  function handleMapPress(event: MapPressEvent) {
    const coordinate = event.nativeEvent.coordinate;
    const newMarker: MarkerComponentProps = {
      id: coordinate.latitude + '_' + coordinate.longitude,
      coordinate: {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      },
      title: 'New Marker',
      description: 'Description of the new marker',
      pinColor: theme.colors.primary,
    };

    setMarkers([...markers, newMarker]);
  }

  return (
    <MapView
      {...props}
      ref={mapRef}
      mapPadding={{
        right: 0,
        left: defaultPositions.left,
        top: defaultPositions.top,
        bottom: defaultPositions.bottom,
      }}
      onPress={handleMapPress}
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      region={initialRegion}
      showsCompass={false}
      showsUserLocation={true}
    >
      {markers.map(marker => (
        <MarkerComponent key={marker.id} {...marker} />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
