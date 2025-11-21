import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, Modal } from 'react-native-paper';
import { ApiService } from '../api/api.service';
import defaultMargins from '../settings/margins';
import defaultBorderRadius from '../settings/radius';
import AutoCompleteComponent from './autoCompleteComponent';
import CustomTextInput from './TextInputComponent';

interface NewPostModalProps {
  isVisible?: boolean;
  handleToggleModal?: (state: boolean) => void;
  takenPhotoUri?: string;
  onSavePost?: (postData: any) => void;
}

export default function NewPostModal(props: Readonly<NewPostModalProps>) {
  const api = new ApiService();
  const [modalVisible, setModalVisible] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    selectedItem: undefined,
    description: '',
  });

  useEffect(() => {
    if (props.isVisible !== undefined) {
      setModalVisible(props.isVisible);
    }

    fetchCategories();
  }, [props.isVisible]);

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

  function handleSelectItem(item: any) {
    setFormData(prevData => ({
      ...prevData,
      selectedItem: item,
    }));
  }

  function handleModalDismiss() {
    setModalVisible(false);
    if (props.handleToggleModal) {
      props.handleToggleModal(false);
    }
  }

  async function handleSave() {
    const postData = {
      category: formData.selectedItem,
      description: formData.description,
      photoUri: props.takenPhotoUri,
    };

    if (props.onSavePost) {
      props.onSavePost(postData);
    }

    setFormData({ selectedItem: undefined, description: '' });
  }

  return (
    <Modal
      visible={modalVisible}
      onDismiss={handleModalDismiss}
      style={styles.modal}
    >
      <Card mode="contained" style={{ ...styles.card }}>
        <Card.Title title="Relatar problema" />
        <Card.Cover
          style={{
            margin: 16,
            marginTop: 0,
            borderRadius: defaultBorderRadius + 4,
          }}
          source={{ uri: props.takenPhotoUri }}
        />
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
        <Card.Actions style={{ marginTop: 16 }}>
          <Button textColor="black" onPress={handleModalDismiss}>
            Cancelar
          </Button>
          <Button onPress={handleSave}>Salvar</Button>
        </Card.Actions>
      </Card>
    </Modal>
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
  photoPreview: {
    width: '100%',
    height: 250,
    backgroundColor: '#f0f0f0',
  },
});
