import SecureStoreService from '../storage/secureStore.service';
import ApiServiceInterface from './api.interface';

const GUEST_CREDENTIALS = {
  username: 'guest',
  password: 'guest',
};

export class ApiService implements ApiServiceInterface {
  private readonly apiUrl = process.env.EXPO_PUBLIC_API_URL;
  private readonly secureStoreService = new SecureStoreService();
  private readonly shouldAuthenticate: boolean;
  private static isLoggingInAsGuest = false;

  constructor(props?: { shouldAuthenticate: boolean }) {
    this.shouldAuthenticate = props?.shouldAuthenticate ?? true;
  }

  private async getAuthorizationHeader(): Promise<Record<string, string>> {
    if (this.shouldAuthenticate) {
      const token = await this.secureStoreService.getItem('authorization');
      if (token) {
        return {
          Authorization: `Bearer ${token}`,
        };
      }
    }
    return {};
  }

  private async loginAsGuest(): Promise<string | null> {
    if (ApiService.isLoggingInAsGuest) {
      return null;
    }

    ApiService.isLoggingInAsGuest = true;
    console.log('Logging in as guest...');

    try {
      const response = await fetch(`${this.apiUrl}/accounts/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: GUEST_CREDENTIALS.username,
          senha: GUEST_CREDENTIALS.password,
        }),
      });

      if (!response.ok) {
        console.error('Failed to login as guest');
        return null;
      }

      const data = await response.json();
      await this.secureStoreService.setItem('authorization', data.access);
      console.log('Guest login successful');
      return data.access;
    } catch (error) {
      console.error('Error logging in as guest:', error);
      return null;
    } finally {
      ApiService.isLoggingInAsGuest = false;
    }
  }

  private async request(
    endpoint: string,
    options: RequestInit = {},
    params?: Record<string, string>
  ): Promise<Response> {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : '';
    const url = `${this.apiUrl}/${endpoint}/${queryString}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        ...(await this.getAuthorizationHeader()),
        ...options.headers,
      },
    });

    if (
      (response.status === 401 || response.status === 403) &&
      this.shouldAuthenticate
    ) {
      const errorData = await response
        .clone()
        .json()
        .catch(() => ({}));

      const isAuthError =
        errorData?.detail === 'Token expirado' ||
        errorData?.detail === 'Token inválido' ||
        errorData?.detail ===
          'As credenciais de autenticação não foram fornecidas.';

      if (isAuthError) {
        console.log('Auth error, logging in as guest and retrying...');
        const guestToken = await this.loginAsGuest();
        if (guestToken) {
          // Retry the request with the new guest token
          return this.request(endpoint, options, params);
        }
      }
    }

    return response;
  }

  async get(endpoint: string, params?: Record<string, string>) {
    return this.request(endpoint, {}, params);
  }

  async post(endpoint: string, body: any) {
    const isFormData = body instanceof FormData;
    return this.request(endpoint, {
      method: 'POST',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  async put(endpoint: string, body: any) {
    return this.request(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  async delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}
