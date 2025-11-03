import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, FAB as Fab, Modal, useTheme } from 'react-native-paper';
import MapViewComponent from '../components/MapViewComponent';
import CustomTextInput from '../components/TextInput';
import defaultMargins from '../settings/margins';
import defaultPositions from '../settings/positions';
import defaultBorderRadius from '../settings/radius';

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
        <Card mode="contained" style={{ ...styles.card }}>
          <Card.Title title="Relatar problema" />
          <Card.Content>
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
