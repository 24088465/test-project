export interface FetchApi {
  url: string;
  body: string;
  type: 'GET' | 'POST' | 'DELETE' | 'PUT';
}
