import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from '../../../components/IconComponent';
import { Comment, Post } from '../post.types';
import { formatRelativeTime, formatViewCommentsText } from '../post.utils';

interface PostCardComponentProps {
  post: Post;
  style?: ViewStyle;
  onPress?: () => void;
  onSubmitComment?: (postId: string, content: string) => Promise<void>;
  onLoadComments?: (postId: string) => Promise<void>;
  comments?: Comment[];
  isLoadingComments?: boolean;
}

export default function PostCardComponent({
  post,
  style,
  onPress,
  onSubmitComment,
  onLoadComments,
  comments = [],
  isLoadingComments = false,
}: Readonly<PostCardComponentProps>) {
  const theme = useTheme();
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const relativeDate = formatRelativeTime(post.criado_em);
  const isGuestUser =
    !post.autor?.username ||
    post.autor.username.toLowerCase() === 'guest' ||
    post.autor.username === 'Anônimo';

  const handleLoadComments = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }

    if (onLoadComments) {
      await onLoadComments(post.id);
    }
    setShowComments(true);
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !onSubmitComment || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmitComment(post.id, commentText.trim());
      setCommentText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayComments =
    comments.length > 0 ? comments : (post.comentarios ?? []);
  const commentsCount = displayComments.length;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.avatar,
              styles.avatarContainer,
              { backgroundColor: theme.colors.primary },
            ]}
          >
            <Icon
              name={isGuestUser ? 'user-secret' : 'user'}
              size={18}
              color="#fff"
            />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.username}>{post.nome}</Text>
            <Text style={styles.location}>
              {post.autor?.username || 'Anônimo'}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.relativeDate}>{relativeDate}</Text>
          <TouchableOpacity style={styles.moreButton} onPress={onPress}>
            <Icon name="ellipsis-vertical" size={16} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {post.imagem && (
        <Image
          source={{ uri: post.imagem }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <View style={styles.content}>
        {!!post.conteudo && <Text style={styles.caption}>{post.conteudo}</Text>}

        {commentsCount > 0 ? (
          <TouchableOpacity
            onPress={handleLoadComments}
            style={styles.viewComments}
            disabled={isLoadingComments}
          >
            <Text style={styles.viewCommentsText}>
              {formatViewCommentsText(
                isLoadingComments,
                showComments,
                commentsCount
              )}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleLoadComments}
            style={styles.viewComments}
            disabled={isLoadingComments}
          >
            <Text style={styles.viewCommentsText}>
              {isLoadingComments ? 'Carregando...' : 'Ver comentários'}
            </Text>
          </TouchableOpacity>
        )}

        {showComments && displayComments.length > 0 && (
          <View style={styles.commentsList}>
            {displayComments.map(comment => {
              const commentUsername =
                comment.autor_username || comment.autor_nome;
              const isCommentGuestUser =
                !commentUsername ||
                commentUsername.toLowerCase() === 'guest' ||
                commentUsername === 'Anônimo';
              return (
                <View key={comment.id} style={styles.commentItem}>
                  <View
                    style={[
                      styles.commentItemAvatar,
                      { backgroundColor: theme.colors.primary },
                    ]}
                  >
                    <Icon
                      name={isCommentGuestUser ? 'user-secret' : 'user'}
                      size={10}
                      color="#fff"
                    />
                  </View>
                  <View style={styles.commentItemContent}>
                    <Text style={styles.commentText}>
                      <Text style={styles.commentUsername}>
                        {commentUsername || 'Anônimo'}
                      </Text>{' '}
                      {comment.conteudo}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>

      <View style={styles.commentInputContainer}>
        <View
          style={[
            styles.commentAvatar,
            styles.commentAvatarContainer,
            { backgroundColor: theme.colors.primary },
          ]}
        >
          <Icon
            name={isGuestUser ? 'user-secret' : 'user'}
            size={14}
            color="#fff"
          />
        </View>
        <TextInput
          style={styles.commentInput}
          placeholder="Adicione um comentário..."
          placeholderTextColor="#999"
          value={commentText}
          onChangeText={setCommentText}
          multiline
          maxLength={500}
          editable={!isSubmitting}
        />
        {commentText.trim().length > 0 && (
          <TouchableOpacity
            onPress={handleSubmitComment}
            disabled={isSubmitting}
            style={styles.postButton}
          >
            <Text
              style={[
                styles.postButtonText,
                { color: isSubmitting ? '#999' : theme.colors.primary },
              ]}
            >
              {isSubmitting ? '...' : 'Publicar'}
            </Text>
          </TouchableOpacity>
        )}
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
    paddingRight: 18,
    paddingVertical: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 10,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  moreButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 14,
    paddingBottom: 8,
  },
  caption: {
    fontSize: 16,
    lineHeight: 24,
    color: '#222',
    fontWeight: '500',
    paddingTop: 8,
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  captionUsername: {
    fontWeight: '600',
  },
  viewComments: {
    marginTop: 6,
  },
  viewCommentsText: {
    fontSize: 14,
    color: '#999',
  },
  commentPreviewContainer: {
    marginTop: 8,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#ddd',
  },
  commentPreview: {
    fontSize: 14,
    lineHeight: 20,
  },
  commentUsername: {
    fontWeight: '700',
    color: '#333',
  },
  commentText: {
    color: '#555',
  },
  relativeDate: {
    fontSize: 12,
    color: '#999',
    marginRight: 8,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  commentAvatar: {
    marginRight: 10,
  },
  commentAvatarContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    paddingVertical: 4,
    maxHeight: 80,
  },
  postButton: {
    paddingLeft: 10,
  },
  postButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  commentsList: {
    marginTop: 10,
    paddingLeft: 4,
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  commentItemAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  commentItemContent: {
    flex: 1,
  },
});
