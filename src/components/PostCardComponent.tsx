import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { Post } from '../types/post';

interface PostCardComponentProps {
  post: Post;
  style?: ViewStyle;
  onPress?: () => void;
}

export default function PostCardComponent({
  post,
  style,
  onPress,
}: PostCardComponentProps) {
  return (
    <Card style={[styles.card, style]} onPress={onPress}>
      {post.imagem && <Card.Cover source={{ uri: post.imagem }} />}
      <Card.Content style={styles.content}>
        <Text variant="titleMedium" style={styles.title}>
          {post.nome}
        </Text>
        <Text variant="bodyMedium" style={styles.description}>
          {post.conteudo}
        </Text>
        {post.autor && (
          <Text variant="labelSmall" style={styles.author}>
            por {post.autor.username}
          </Text>
        )}
        <Text variant="labelSmall" style={styles.date}>
          {new Date(post.criado_em).toLocaleDateString('pt-BR')}
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
  },
  content: {
    paddingTop: 12,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    color: '#555',
  },
  author: {
    color: '#888',
    marginTop: 8,
  },
  date: {
    color: '#aaa',
    marginTop: 2,
  },
});
