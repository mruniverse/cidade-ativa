import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FAB as Fab } from 'react-native-paper';
import MapViewComponent from '../components/MapViewComponent';

export default function Index() {
  function handleFabPress() {
    console.log('FAB Pressed');
  }

  return (
    <View style={styles.container}>
      <Fab
        onPress={handleFabPress}
        icon="plus"
        style={styles.buttonContainer}
      />
      <MapViewComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    zIndex: 1,
  },
});
