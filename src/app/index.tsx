import {
  getCurrentPositionAsync,
  LocationAccuracy,
  LocationObject,
  requestForegroundPermissionsAsync,
  watchPositionAsync,
} from 'expo-location';
import React, {useEffect, useRef, useState} from 'react';
import {Button, Modal, StyleSheet, Text, View} from 'react-native';
import MapView from 'react-native-maps';
import IssueMarker, {IssueType} from '../components/IssueMarker';

export default function Index() {
  const [location, setLocation] = useState<LocationObject | null>(null);

  const mapRef = useRef<MapView>(null);

  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();

    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
    }
  }

  useEffect(() => {
    requestLocationPermissions();
  }, []);

  useEffect(() => {
    watchPositionAsync(
      {
        accuracy: LocationAccuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      response => {
        setLocation(response);
        mapRef.current?.animateCamera({
          pitch: 70,
          center: response.coords,
        });
      }
    );
  }, []);

  // exemplo de issues; adapte para carregar de API/estado conforme necessário
  type Issue = {
    id: string;
    coordinate: { latitude: number; longitude: number };
    type: IssueType;
    title?: string;
    description?: string;
  };

  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const issues: Issue[] = [
    {
      id: '1',
      coordinate: { latitude: -24.0438, longitude: -52.3811 },
      type: IssueType.Buraco,
      title: 'Buraco na rua',
      description: 'Grande buraco próximo ao cruzamento',
    },
    {
      id: '2',
      coordinate: { latitude: -24.046, longitude: -52.383 },
      type: IssueType.MaSinalizacao,
      title: 'Sinalização ruim',
      description: 'Sem placa de alerta na curva',
    },
  ];

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          {issues.map(issue => (
            <IssueMarker
              key={issue.id}
              coordinate={issue.coordinate}
              type={issue.type}
              title={issue.title}
              description={issue.description}
              onPress={() => setSelectedIssue(issue)}
            />
          ))}
        </MapView>
      )}

      <Modal
        visible={selectedIssue !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedIssue(null)}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.content}>
            <Text style={modalStyles.title}>{selectedIssue?.title}</Text>
            <Text style={modalStyles.description}>
              {selectedIssue?.description}
            </Text>
            <View style={modalStyles.actions}>
              <Button title="Fechar" onPress={() => setSelectedIssue(null)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    maxWidth: 420,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
