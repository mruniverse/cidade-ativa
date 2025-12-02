export interface Comment {
  id: string;
  autor_id: string;
  autor_nome: string;
  autor_username?: string;
  postagem: string;
  conteudo: string;
  criado_em: string;
}

export interface Post {
  id: string;
  nome: string;
  conteudo: string;
  tipo: string;
  latitude: number;
  longitude: number;
  criado_em: string;
  imagem?: string | null;
  autor?: {
    id: string;
    username: string;
  };
  comentarios?: Comment[];
}

export interface CreateCommentPayload {
  postagem: string;
  conteudo: string;
}
