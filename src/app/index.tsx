import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { FAB as Fab, useTheme } from 'react-native-paper';
import CameraComponent from '../components/CameraComponent';
import MapViewComponent from '../components/MapViewComponent';
import NewPostModal from '../features/posts/components/NewPostModal';
import defaultPositions from '../settings/positions';

export default function Index() {
  const theme = useTheme();
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [takenPhotoUri, setTakenPhotoUri] = useState<string | null>(null);
  const [isNewPostModalVisible, setIsNewPostModalVisible] = useState(false);
  const [newMarker, setNewMarker] = useState<any>(null);

  function handleFabPress() {
    setIsCameraVisible(true);
  }

  function handlePictureTaken(photoUri: string) {
    setTakenPhotoUri(photoUri);
    setIsCameraVisible(false);
    setIsNewPostModalVisible(true);
    console.debug('Photo taken with URI:', photoUri);
  }

  function handleSavePost(postData: any) {
    const markerData = { ...postData, timestamp: Date.now() };
    setNewMarker(markerData);
    setIsNewPostModalVisible(false);
    setTakenPhotoUri(null);
  }

  return (
    <View style={styles.container}>
      <Fab
        onPress={handleFabPress}
        icon="plus"
        style={{
          ...styles.buttonContainer,
          borderRadius: theme.roundness,
          backgroundColor: theme.colors.primary,
        }}
      />
      <MapViewComponent onNewMarker={newMarker} />
      <CameraComponent
        isVisible={isCameraVisible}
        handleToggleModal={setIsCameraVisible}
        handlePictureTaken={handlePictureTaken}
      />
      <NewPostModal
        isVisible={isNewPostModalVisible}
        handleToggleModal={setIsNewPostModalVisible}
        takenPhotoUri={takenPhotoUri || undefined}
        onSavePost={handleSavePost}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
