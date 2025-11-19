import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from 'react-native';
import { Text } from 'react-native-paper';

import ApiService from '../api/api.service';
import PostCard from '../components/PostCard';
import { Post } from '../types/post';

export default function Postagens() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null
  );

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permissão de localização negada');
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setCoords({
          lat: location.coords.latitude,
          lon: location.coords.longitude,
        });
      } catch {
        setError('Erro ao obter localização');
      }
    })();
  }, []);

  useEffect(() => {
    if (coords) loadPosts(1, coords.lat, coords.lon);
  }, [coords]);

  async function loadPosts(page: number, lat: number, lon: number) {
    setLoading(true);
    try {
      const data = await ApiService.getPosts(page, lat, lon);
      if (!data) throw new Error('Nenhuma postagem encontrada');
      setPosts(prev => (page === 1 ? data : [...prev, ...data]));
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {error && <Text style={{ color: 'red', margin: 10 }}>{error}</Text>}
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        onEndReached={() => {
          if (!loading && coords) {
            setPage(prev => prev + 1);
            loadPosts(page + 1, coords.lat, coords.lon);
          }
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              if (coords) loadPosts(1, coords.lat, coords.lon);
            }}
          />
        }
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" /> : null
        }
      />
    </View>
  );
}
