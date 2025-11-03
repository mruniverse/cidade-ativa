import React from 'react';
import {StyleSheet, View} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default function Index() {
  const initialRegion = {
    latitude: -24.0438,
    longitude: -52.3811,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        showsUserLocation
        showsMyLocationButton
        provider={PROVIDER_GOOGLE}
        region={initialRegion}
      />
    </View>
  );
}
