import Constants from 'expo-constants';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

import { useAuth } from '../features/auth/authProvider';
import PostCardComponent from '../features/posts/components/PostCard';
import PostDetailModal from '../features/posts/components/PostDetailModal';
import { Post } from '../features/posts/post.types';
import { usePost } from '../features/posts/postProvider';
import defaultPositions from '../settings/positions';

export default function Postagens() {
  const { user } = useAuth();
  const {
    posts,
    loading,
    error,
    loadPosts,
    refreshPosts,
    deletePost,
    addComment,
    loadPostComments,
  } = usePost();
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingCommentsFor, setLoadingCommentsFor] = useState<string | null>(
    null
  );
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

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

  const handleSubmitComment = async (postId: string, content: string) => {
    await addComment(postId, content);
  };

  const handleLoadComments = async (postId: string) => {
    setLoadingCommentsFor(postId);
    try {
      await loadPostComments(postId);
    } finally {
      setLoadingCommentsFor(null);
    }
  };

  const handleDeletePost = (postId: string) => {
    Alert.alert(
      'Excluir postagem',
      'Tem certeza que deseja excluir esta postagem?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            deletePost(postId).catch(() => {
              Alert.alert('Erro', 'Não foi possível excluir a postagem.');
            });
          },
        },
      ]
    );
  };

  const reversedPosts = [...posts].reverse();

  return (
    <View style={{ flex: 1 }}>
      {error && <Text style={{ color: 'red', margin: 10 }}>{error}</Text>}
      <FlatList
        data={reversedPosts}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item, index }) => {
          const isFirst = index === 0;
          const isLast = index === reversedPosts.length - 1;

          return (
            <PostCardComponent
              post={item}
              style={{
                ...(isFirst && { marginTop: Constants.statusBarHeight }),
                ...(isLast && { marginBottom: defaultPositions.bottom }),
              }}
              currentUserId={user?.id}
              onViewPress={() => setSelectedPost(item)}
              onDeletePress={() => handleDeletePost(item.id)}
              onImagePress={() => setSelectedPost(item)}
              onSubmitComment={handleSubmitComment}
              onLoadComments={handleLoadComments}
              isLoadingComments={loadingCommentsFor === item.id}
            />
          );
        }}
        onEndReached={handleLoadMore}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListFooterComponent={
          loading && !refreshing ? <ActivityIndicator size="large" /> : null
        }
      />

      <PostDetailModal
        post={selectedPost}
        visible={selectedPost !== null}
        onClose={() => setSelectedPost(null)}
      />
    </View>
  );
}
