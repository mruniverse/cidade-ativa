import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, Modal } from 'react-native-paper';
import { ApiService } from '../api/api.service';
import defaultMargins from '../settings/margins';
import defaultBorderRadius from '../settings/radius';
import { Category } from '../types/category';
import { getLocationData } from '../utils/location.utils';
import AutoCompleteComponent from './autoCompleteComponent';
import CustomTextInput from './TextInputComponent';

interface NewPostModalProps {
  isVisible?: boolean;
  handleToggleModal?: (state: boolean) => void;
  takenPhotoUri?: string;
  onSavePost?: (postData: {
    category?: Category;
    description: string;
    photoUri?: string;
  }) => void;
}

export default function NewPostModal(props: Readonly<NewPostModalProps>) {
  const api = new ApiService();
  const [modalVisible, setModalVisible] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    selectedItem?: Category;
    description: string;
  }>({
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
      const data = (await response.json()) as Category[];
      if (data?.length > 0) {
        setCategories(data);
      } else {
        console.log('No categories found.', data);
      }
    });
  }

  function handleSelectItem(item: { id: string; title: string } | null) {
    if (item) {
      const selectedCategory = categories.find(cat => cat.id === item.id);
      setFormData(prevData => ({
        ...prevData,
        selectedItem: selectedCategory,
      }));
    }
  }

  function handleModalDismiss() {
    setModalVisible(false);
    if (props.handleToggleModal) {
      props.handleToggleModal(false);
    }
  }

  async function handleSave() {
    if (!formData.selectedItem) {
      console.log('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);

    try {
      const locationData = await getLocationData();
      const formDataToSend = new FormData();

      formDataToSend.append('nome', formData.selectedItem.name);
      formDataToSend.append('conteudo', formData.description || '');
      formDataToSend.append('category', formData.selectedItem.id);
      formDataToSend.append(
        'latitude',
        (locationData.latitude * 10000).toFixed(0)
      );
      formDataToSend.append(
        'longitude',
        (locationData.longitude * 10000).toFixed(0)
      );

      if (props.takenPhotoUri) {
        const imageFile = {
          uri: props.takenPhotoUri,
          type: 'image/jpeg',
          name: 'photo.jpg',
        } as any;
        formDataToSend.append('imagem', imageFile);
      }

      console.log('Sending post data...');
      const createdPost = await api.createPost(formDataToSend);
      console.log('Post created successfully:', createdPost);

      if (props.onSavePost) {
        props.onSavePost({
          category: formData.selectedItem,
          description: formData.description,
          photoUri: props.takenPhotoUri,
        });
      }

      setFormData({ selectedItem: undefined, description: '' });
      handleModalDismiss();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
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
            dataSet={categories.map(cat => ({ id: cat.id, title: cat.name }))}
          />
          <CustomTextInput
            placeholder="Descreva o problema"
            multiline={true}
            numberOfLines={4}
            value={formData.description}
            onChangeText={text =>
              setFormData(prev => ({ ...prev, description: text }))
            }
          />
        </Card.Content>
        <Card.Actions style={{ marginTop: 16 }}>
          <Button
            textColor="black"
            onPress={handleModalDismiss}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button onPress={handleSave} loading={loading} disabled={loading}>
            Salvar
          </Button>
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
