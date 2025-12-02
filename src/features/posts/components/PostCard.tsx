import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Avatar, Text, useTheme } from 'react-native-paper';
import Icon, { IconOutline } from '../../../components/IconComponent';
import { Post } from '../post.types';

interface PostCardComponentProps {
  post: Post;
  style?: ViewStyle;
  onPress?: () => void;
}

function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'agora';
  if (diffMins < 60) return `${diffMins}min`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString('pt-BR');
}

export default function PostCardComponent({
  post,
  style,
  onPress,
}: Readonly<PostCardComponentProps>) {
  const theme = useTheme();
  const timeAgo = getTimeAgo(post.criado_em);
  const authorInitial = post.autor?.username?.charAt(0).toUpperCase() || '?';

  return (
    <View style={[styles.container, style]}>
      {/* Header - Instagram style */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Avatar.Text
            size={36}
            label={authorInitial}
            style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.username}>
              {post.autor?.username || 'Anônimo'}
            </Text>
            <Text style={styles.location}>{post.nome}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="ellipsis-vertical" size={16} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Image */}
      {post.imagem && (
        <Image
          source={{ uri: post.imagem }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onPress}>
          <IconOutline name="comment" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {!!post.conteudo && (
          <Text style={styles.caption}>
            <Text style={styles.captionUsername}>
              {post.autor?.username || 'Anônimo'}
            </Text>{' '}
            {post.conteudo}
          </Text>
        )}
        <Text style={styles.timeAgo}>{timeAgo}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 10,
  },
  headerInfo: {
    justifyContent: 'center',
  },
  username: {
    fontWeight: '600',
    fontSize: 14,
  },
  location: {
    fontSize: 12,
    color: '#666',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  actionButton: {
    padding: 8,
  },
  content: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
  },
  captionUsername: {
    fontWeight: '600',
  },
  timeAgo: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },
});
