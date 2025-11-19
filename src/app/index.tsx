import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, FAB as Fab, Modal, useTheme } from 'react-native-paper';
import { ApiService } from '../api/api.service';
import AutoCompleteComponent from '../components/autoCompleteComponent';
import MapViewComponent from '../components/MapViewComponent';
import CustomTextInput from '../components/TextInputComponent';
import defaultMargins from '../settings/margins';
import defaultPositions from '../settings/positions';
import defaultBorderRadius from '../settings/radius';

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
    fetchCategories();
  }, []);

  function fetchCategories() {
    api.get('api/categories').then(async response => {
      const data = (await response.json()) as any[];
      if (data?.length > 0) {
        setCategories(data.map(item => ({ title: item.name, id: item.id })));
      } else {
        console.log('No categories found.', data);
      }
    });
  }

  function handleFabPress() {
    setModalVisible(true);
  }

  function handleSelectItem(item: any) {
    setFormData(prevData => ({
      ...prevData,
      selectedItem: item,
    }));
  }

  return (
    <View style={styles.container}>
      <Fab
        onPress={handleFabPress}
        icon="plus"
        style={{
          ...styles.buttonContainer,
          borderRadius: theme.roundness,
        }}
      />
      <MapViewComponent />
      <Modal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        style={styles.modal}
      >
        <Card mode="contained" style={{ ...styles.card }}>
          <Card.Title title="Relatar problema" />
          <Card.Content style={{ gap: 4 }}>
            <AutoCompleteComponent
              placeholder="Selecione o tipo de problema"
              handleSelectItem={handleSelectItem}
              selectedItem={formData.selectedItem}
              dataSet={categories}
            />
            <CustomTextInput
              placeholder="Descreva o problema"
              multiline={true}
              numberOfLines={4}
            />
          </Card.Content>
        </Card>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    padding: defaultMargins.default,
  },
  card: {
    padding: 8,
    borderRadius: defaultBorderRadius + 4,
  },
  container: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: defaultPositions.bottom,
    right: defaultPositions.right,
    zIndex: 1,
  },
});
