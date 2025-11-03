import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, FAB as Fab, Modal, useTheme } from 'react-native-paper';
import MapViewComponent from '../components/MapViewComponent';
import CustomTextInput from '../components/TextInput';
import defaultPositions from '../settings/positions';

export default function Index() {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = React.useState(false);

  function handleFabPress() {
    setModalVisible(true);
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
        <Card mode="contained" style={styles.card}>
          <CustomTextInput label="New Post" />
        </Card>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    padding: 20,
  },
  card: {
    padding: 20,
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
