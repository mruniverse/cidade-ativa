import { ApiService } from '../../api/api.service';
import { Comment, CreateCommentPayload, Post } from './post.types';

export class PostService {
  private readonly apiService: ApiService;

  constructor(apiService?: ApiService) {
    this.apiService = apiService ?? new ApiService();
  }

  async getPosts(page: number, lat: number, lon: number): Promise<Post[]> {
    const response = await this.apiService.get('postagens', {
      page: page.toString(),
      lat: lat.toString(),
      lon: lon.toString(),
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar postagens');
    }

    return response.json();
  }

  async getPostById(id: string): Promise<Post> {
    const response = await this.apiService.get('postagens/read', {
      postagem_id: id,
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar postagem');
    }

    return response.json();
  }

  async createPost(formData: FormData): Promise<Post> {
    const response = await this.apiService.post('postagens/criar', formData);

    if (!response.ok) {
      throw new Error('Erro ao criar postagem');
    }

    return response.json();
  }

  async updatePost(id: string, data: Partial<Post>): Promise<Post> {
    const response = await this.apiService.put(`postagens/${id}`, data);

    if (!response.ok) {
      throw new Error('Erro ao atualizar postagem');
    }

    return response.json();
  }

  async deletePost(id: string): Promise<void> {
    const response = await this.apiService.delete(`postagens/deletar/${id}`);

    if (!response.ok) {
      throw new Error('Erro ao deletar postagem');
    }
  }

  // Comments
  async createComment(payload: CreateCommentPayload): Promise<{ id: string }> {
    const response = await this.apiService.post('postagens/comentar', payload);

    if (!response.ok) {
      throw new Error('Erro ao criar comentário');
    }

    return response.json();
  }

  async deleteComment(comentarioId: string): Promise<void> {
    const response = await this.apiService.delete(
      `postagens/comentarios/deletar/${comentarioId}`
    );

    if (!response.ok) {
      throw new Error('Erro ao deletar comentário');
    }
  }

  async getPostComments(postagemId: string): Promise<Comment[]> {
    const post = await this.getPostById(postagemId);
    return post.comentarios ?? [];
  }
}
