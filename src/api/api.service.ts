import SecureStoreService from '../storage/secureStore.service';
import { Post } from '../types/post';
import ApiServiceInterface from './api.interface';

export class ApiService implements ApiServiceInterface {
  private readonly apiUrl = process.env.EXPO_PUBLIC_API_URL;
  private readonly secureStoreService = new SecureStoreService();
  private readonly shouldAuthenticate: boolean;

  constructor(props?: { shouldAuthenticate: boolean }) {
    this.shouldAuthenticate = props?.shouldAuthenticate ?? true;
  }

  private async getAuthorizationHeader() {
    if (this.shouldAuthenticate) {
      return {
        Authorization: `Bearer ${await this.secureStoreService.getItem('authorization')}`,
      };
    }
  }

  async get(endpoint: string, params?: Record<string, string>) {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return fetch(`${this.apiUrl}/${endpoint}/?${queryString}`, {
      headers: {
        ...(await this.getAuthorizationHeader()),
      },
    }).catch(error => {
      console.error('API Service GET Error:', error);
      throw error;
    });
  }

  async post(endpoint: string, body: any) {
    console.log(`${this.apiUrl}/${endpoint}/`);
    return fetch(`${this.apiUrl}/${endpoint}/`, {
      method: 'POST',
      headers: {
        ...(await this.getAuthorizationHeader()),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).catch(error => {
      console.error('API Service POST Error:', error);
      throw error;
    });
  }

  async put(endpoint: string, body: any) {
    return fetch(`${this.apiUrl}/${endpoint}/`, {
      method: 'PUT',
      headers: {
        ...(await this.getAuthorizationHeader()),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }

  async delete(endpoint: string) {
    return fetch(`${this.apiUrl}/${endpoint}/`, {
      method: 'DELETE',
      headers: { ...(await this.getAuthorizationHeader()) },
    });
  }

  async getPosts(page: number, lat: number, lon: number): Promise<Post[]> {
    const response = await this.get('postagens', {
      page: page.toString(),
      lat: lat.toString(),
      lon: lon.toString(),
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar postagens');
    }

    const data = await response.json();
    return data as Post[];
  }

  async createPost(formData: FormData): Promise<Post> {
    const response = await fetch(`${this.apiUrl}/postagens/criar/`, {
      method: 'POST',
      headers: {
        ...(await this.getAuthorizationHeader()),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Erro ao criar postagem');
    }

    const data = await response.json();
    return data as Post;
  }

  async login(username: string, senha: string) {
    const response = await fetch(`${this.apiUrl}/accounts/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, senha }),
    });

    if (!response.ok) {
      throw new Error('Erro ao fazer login');
    }

    const data = await response.json();
    await this.secureStoreService.setItem('authorization', data.access);
    return data;
  }

  async register(username: string, email: string, senha: string, senha2: string) {
    const response = await fetch(`${this.apiUrl}/accounts/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, senha, senha2 }),
    });

    if (!response.ok) {
      throw new Error('Erro ao registrar usuário');
    }

    const data = await response.json();
    return data;
  }

  async logout() {
    await this.secureStoreService.deleteItem('authorization');
  }
}
