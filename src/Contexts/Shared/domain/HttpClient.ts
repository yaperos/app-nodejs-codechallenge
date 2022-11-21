export interface HttpClient {
  get(url: string, data?: any, config?: any): Promise<HttpClientResponse>;
  post(url: string, data?: any, config?: any): Promise<any>;
  put(url: string, data?: any, config?: any): Promise<any>;
  patch(url: string, data?: any, config?: any): Promise<any>;
  delete(url: string, config?: any): Promise<any>;
}

export interface HttpClientResponse {
  statusCode: number;
  body?: any;
  success: boolean;
}
