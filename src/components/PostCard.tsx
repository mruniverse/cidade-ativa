import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Post } from '../types/post';

interface Props {
  post: Post;
}

export default function PostCard({ post }: Props) {
  return (
    <View style={styles.card}>
      {post.imagem && (
        <Image source={{ uri: post.imagem }} style={styles.image} />
      )}
      <Text style={styles.title}>{post.nome}</Text>
      <Text style={styles.description}>{post.conteudo}</Text>
      {post.autor && (
        <Text style={styles.author}>por {post.autor.username}</Text>
      )}
      <Text style={styles.date}>
        {new Date(post.criado_em).toLocaleDateString('pt-BR')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  author: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },
});
