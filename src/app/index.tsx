import React, {useState} from 'react';
import {Button, Modal, StyleSheet, Text, View} from 'react-native';
import MapView from 'react-native-maps';
import IssueMarker, {IssueType} from '../components/IssueMarker';

export default function Index() {
  const theme = useTheme();
  const api = new ApiService();
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    selectedItem: undefined,
    description: '',
  });
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    api.get('api/categories').then(async response => {
      const data = (await response.json()) as any[];
      setCategories(data.map(item => ({ title: item.name, id: item.id })));
    });
  }, [categories.length]);

  function handleFabPress() {
    setModalVisible(true);
  }

  function handleSelectItem(item: any) {
    setFormData(prevData => ({
      ...prevData,
      selectedItem: item,
    }));
  }

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
      <MapView
        style={styles.map}
        showsUserLocation
        showsMyLocationButton
        region={initialRegion}
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
