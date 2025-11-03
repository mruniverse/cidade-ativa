import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, FAB as Fab, Modal, useTheme } from 'react-native-paper';
import AutoCompleteComponent from '../components/autoCompleteComponent';
import MapViewComponent from '../components/MapViewComponent';
import CustomTextInput from '../components/TextInputComponent';
import defaultMargins from '../settings/margins';
import defaultPositions from '../settings/positions';
import defaultBorderRadius from '../settings/radius';

export default function Index() {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    selectedItem: undefined,
    description: '',
  });

  const selectDataSet = [
    { id: '1', title: 'Buraco na rua' },
    { id: '2', title: 'Luz de rua não funcionando' },
    { id: '3', title: 'Árvore caída' },
    { id: '4', title: 'Vazamento de água' },
    { id: '5', title: 'Outro' },
  ];

  async function fetchCategories() {
    const categories = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/categories`
    );
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
          <Card.Content>
            <AutoCompleteComponent
              placeholder="Selecione o tipo de problema"
              handleSelectItem={handleSelectItem}
              selectedItem={formData.selectedItem}
              dataSet={selectDataSet}
            />
            <CustomTextInput
              label="Descreva o problema"
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
