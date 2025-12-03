import { User } from '../features/auth/user.types';
import SecureStoreService from '../storage/secureStore.service';

type LoginResponse = {
  access: string;
  usuario: User;
};

type RegisterResponse = User;

export class AuthService {
  private readonly apiUrl = process.env.EXPO_PUBLIC_API_URL;
  private readonly secureStoreService = new SecureStoreService();

  async login(username: string, senha: string): Promise<LoginResponse> {
    const response = await fetch(`${this.apiUrl}/accounts/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, senha }),
    });

    if (!response.ok) {
      throw new Error('Erro ao fazer login');
    }

    const data = await response.json();
    this.secureStoreService.setItem('authorization', data.access);
    return data;
  }

  async register(
    username: string,
    email: string,
    senha: string,
    senha2: string
  ): Promise<RegisterResponse> {
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

  logout() {
    this.secureStoreService.deleteItem('authorization');
  }
}
