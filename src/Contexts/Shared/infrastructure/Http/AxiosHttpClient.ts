import axios, { Axios, AxiosInstance, AxiosRequestConfig } from 'axios';
import { HttpClient, HttpClientResponse } from '../../domain/HttpClient';

export class AxiosHttpClient implements HttpClient {
  private readonly commonConfiguration: AxiosRequestConfig = {
    timeout: 0,
    withCredentials: false,
    responseType: 'json',
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    maxContentLength: 20000,
    maxRedirects: 3,
  };

  private readonly instance: AxiosInstance;

  constructor(private readonly baseUrl: string, config?: any) {
    this.instance = axios.create({
      baseURL: baseUrl,
      ...this.commonConfiguration,
      ...config,
    });
  }

  private response(response: any, isError = false): HttpClientResponse {
    return !isError
      ? {
          statusCode: response.status,
          success: true,
          body: response.data,
        }
      : {
          statusCode: response.response.status,
          success: false,
          body: response.response.data,
        };
  }

  async delete(url: string, config?: any): Promise<any> {
    try {
      const response = await this.instance.delete(url, config);
      return this.response(response);
    } catch (error: any) {
      return this.response(error, true);
    }
  }

  async get(url: string, config?: any): Promise<HttpClientResponse> {
    try {
      const response = await this.instance.get(url, config);
      return this.response(response);
    } catch (error: any) {
      return this.response(error, true);
    }
  }

  async patch(url: string, data?: any, config?: any): Promise<any> {
    try {
      const response = await this.instance.patch(url, data, config);
      return this.response(response);
    } catch (error: any) {
      return this.response(error, true);
    }
  }

  async post(url: string, data?: any, config?: any): Promise<any> {
    try {
      const response = await this.instance.post(url, data, config);
      return this.response(response);
    } catch (error: any) {
      return this.response(error, true);
    }
  }

  async put(url: string, data?: any, config?: any): Promise<any> {
    try {
      const response = await this.instance.put(url, data, config);
      return this.response(response);
    } catch (error: any) {
      return this.response(error, true);
    }
  }
}
