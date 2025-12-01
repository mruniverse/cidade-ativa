import SecureStoreService from '../storage/secureStore.service';
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

      const isTokenError =
        errorData?.detail === 'Token expirado' ||
        errorData?.detail === 'Token inválido';

      if (isTokenError) {
        console.log('Token invalid, retrying as guest...');
        const guestService = new ApiService({ shouldAuthenticate: false });
        return guestService.request(endpoint, options, params);
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
