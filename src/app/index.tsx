import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { FAB as Fab, useTheme } from 'react-native-paper';
import { PERMISSIONS, request } from 'react-native-permissions';
import MarkerComponent, {
  MarkerComponentProps,
} from '../components/MarkerComponent';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default function Index() {
  const theme = useTheme();
  const [markers, setMarkers] = React.useState<MarkerComponentProps[]>([
    {
      coordinate: { latitude: -24.0438, longitude: -52.3811 },
      title: 'Marker 1',
      description: 'Description of Marker 1',
    },
  ]);

  const initialRegion = {
    latitude: -24.0438,
    longitude: -52.3811,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  useEffect(() => {
    request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
      console.log('Location permission result:', result);
    });
  }, []);

  function handleMapPress(event: any) {
    const coordinate = event.nativeEvent.coordinate;
    const newMarker: MarkerComponentProps = {
      coordinate: {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      },
      title: 'New Marker',
      description: 'Description of the new marker',
      pinColor: theme.colors.primary,
    };

    console.log('Map pressed at coordinate:', newMarker);

    setMarkers([...markers, newMarker]);
  }

  return (
    <View style={styles.container}>
      <Fab
        rippleColor={'rgba(0, 0, 0, 1)'}
        icon="plus"
        style={{
          position: 'absolute',
          bottom: 100,
          right: 16,
          zIndex: 1,
        }}
      />
      <MapView
        mapPadding={{
          left: 0,
          right: 0,
          top: 38,
          bottom: 0,
        }}
        onPress={handleMapPress}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={initialRegion}
        showsUserLocation={true}
      >
        {markers.map((marker, index) => (
          <MarkerComponent key={`marker-${index}`} {...marker} />
        ))}
      </MapView>
    </View>
  );
}
