import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from 'react-native';
import { Text } from 'react-native-paper';

import { ApiService } from '../api/api.service';
import PostCard from '../components/PostCard';
import defaultPositions from '../settings/positions';
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
  const api = new ApiService();

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
    if (!coords) return;

    loadPosts(1, coords.lat, coords.lon);
  }, [coords]);

  async function loadPosts(page: number, lat: number, lon: number) {
    setLoading(true);
    try {
      const data = await api.getPosts(page, lat, lon);
      if (!data) throw new Error('Nenhuma postagem encontrada');

      setPosts(prev => {
        if (page === 1) return data;
        // Remove duplicates based on ID
        const existingIds = new Set(prev.map(p => p.id));
        const newPosts = data.filter(p => !existingIds.has(p.id));
        return [...prev, ...newPosts];
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {error && <Text style={{ color: 'red', margin: 10 }}>{error}</Text>}
      <FlatList
        data={[...posts].reverse()}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item, index }) =>
          index === posts.length - 1 ? (
            <PostCard
              post={item}
              style={{ marginBottom: defaultPositions.bottom }}
            />
          ) : (
            <PostCard post={item} />
          )
        }
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
