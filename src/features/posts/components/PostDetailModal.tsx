import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Text, useTheme } from 'react-native-paper';
import Icon from '../../../components/IconComponent';
import { Post } from '../post.types';
import { formatRelativeTime } from '../post.utils';

interface PostDetailModalProps {
  post: Post | null;
  visible: boolean;
  onClose: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAP_HEIGHT = 200;

export default function PostDetailModal({
  post,
  visible,
  onClose,
}: Readonly<PostDetailModalProps>) {
  const theme = useTheme();
  const [streetAddress, setStreetAddress] = useState<string | null>(null);

  const postCoordinate = post
    ? {
        latitude: -Math.abs(post.latitude / 10000),
        longitude: -Math.abs(post.longitude / 10000),
      }
    : null;

  useEffect(() => {
    if (!post) return;

    const coordinate = {
      latitude: -Math.abs(post.latitude / 10000),
      longitude: -Math.abs(post.longitude / 10000),
    };

    const fetchAddress = async () => {
      try {
        const [address] = await Location.reverseGeocodeAsync(coordinate);
        if (address) {
          const parts = [
            address.street,
            address.streetNumber,
            address.district,
            address.city,
          ].filter(Boolean);
          setStreetAddress(parts.join(', ') || 'Endereço não encontrado');
        }
      } catch {
        setStreetAddress('Endereço não disponível');
      }
    };

    setStreetAddress(null);
    fetchAddress();
  }, [post]);

  if (!post || !postCoordinate) return null;

  const mapRegion = {
    ...postCoordinate,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {post.nome}
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollView}>
          {post.imagem && (
            <Image
              source={{ uri: post.imagem }}
              style={styles.image}
              resizeMode="contain"
            />
          )}

          <View style={styles.content}>
            <View style={styles.authorRow}>
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: theme.colors.primary },
                ]}
              >
                <Icon name="user" size={16} color="#fff" />
              </View>
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>
                  {post.autor?.username || 'Anônimo'}
                </Text>
                <Text style={styles.date}>
                  {formatRelativeTime(post.criado_em)}
                </Text>
              </View>
            </View>

            {!!post.conteudo && (
              <Text style={styles.description}>{post.conteudo}</Text>
            )}

            {streetAddress && (
              <View style={styles.addressRow}>
                <Icon name="location-dot" size={14} color="#666" />
                <Text style={styles.addressText}>{streetAddress}</Text>
              </View>
            )}
          </View>

          <View style={styles.mapContainer}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={mapRegion}
              scrollEnabled={false}
              zoomEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
            >
              <Marker
                coordinate={postCoordinate}
                pinColor={theme.colors.primary}
              />
            </MapView>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  mapContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  map: {
    width: '100%',
    height: MAP_HEIGHT,
  },
});
