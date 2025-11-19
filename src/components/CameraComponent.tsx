import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, FAB as Fab, Modal, Text } from 'react-native-paper';
import defaultMargins from '../settings/margins';
import defaultBorderRadius from '../settings/radius';

interface CameraComponentProps {
  isVisible?: boolean;
  handleToggleModal?: (state: boolean) => void;
  handlePictureTaken?: (photoUri: string) => void;
}

export default function CameraComponent(props: Readonly<CameraComponentProps>) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isModalVisible, setIsModalVisible] = useState(true);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (props.isVisible !== undefined) {
      setIsModalVisible(props.isVisible);
    }
  }, [props.isVisible]);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <Modal visible={true}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission}>grant permission</Button>
      </Modal>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  function handleModalDismiss() {
    setIsModalVisible(false);
    if (props.handleToggleModal) {
      props.handleToggleModal(false);
    }
  }

  async function takePicture() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      console.log(photo);
      handleModalDismiss();
      if (props.handlePictureTaken) {
        props.handlePictureTaken(photo.uri);
      }
    }
  }

  return (
    <Modal
      visible={isModalVisible}
      style={styles.container}
      onDismiss={handleModalDismiss}
    >
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
      <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
        <FontAwesome6 iconStyle="solid" name="rotate" color="white" size={34} />
      </TouchableOpacity>
      <Fab
        label=""
        mode="elevated"
        onPress={() => takePicture()}
        style={styles.fab}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    marginHorizontal: defaultMargins.default,
  },
  camera: {
    width: '100%',
    height: '84%',
    borderRadius: defaultBorderRadius + 8,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  button: {
    position: 'absolute',
    top: 72,
    right: 16,
  },
  fab: {
    bottom: 96,
    padding: 8,
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
  },
});
