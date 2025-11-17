export default interface ApiServiceInterface {
  get(endpoint: string, params?: Record<string, string>): Promise<Response>;
  post(endpoint: string, body: any): Promise<Response>;
  put(endpoint: string, body: any): Promise<Response>;
  delete(endpoint: string): Promise<Response>;
}
