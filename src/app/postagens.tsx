import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from 'react-native';
import { Text } from 'react-native-paper';

import PostCardComponent from '../components/PostCardComponent';
import { usePost } from '../providers/postProvider';
import defaultPositions from '../settings/positions';

export default function Postagens() {
  const { posts, loading, error, loadPosts, refreshPosts } = usePost();
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null
  );

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          return;
        }
        const location = await Location.getCurrentPositionAsync({});
        setCoords({
          lat: location.coords.latitude,
          lon: location.coords.longitude,
        });
      } catch {
        // Location error handled silently
      }
    })();
  }, []);

  useEffect(() => {
    if (!coords) return;
    loadPosts(1, coords.lat, coords.lon);
  }, [coords, loadPosts]);

  const handleLoadMore = () => {
    if (!loading && coords) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadPosts(nextPage, coords.lat, coords.lon);
    }
  };

  const handleRefresh = async () => {
    if (!coords) return;
    setRefreshing(true);
    setPage(1);
    await refreshPosts(coords.lat, coords.lon);
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {error && <Text style={{ color: 'red', margin: 10 }}>{error}</Text>}
      <FlatList
        data={[...posts].reverse()}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item, index }) =>
          index === posts.length - 1 ? (
            <PostCardComponent
              post={item}
              style={{ marginBottom: defaultPositions.bottom }}
            />
          ) : (
            <PostCardComponent post={item} />
          )
        }
        onEndReached={handleLoadMore}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" /> : null
        }
      />
    </View>
  );
}
