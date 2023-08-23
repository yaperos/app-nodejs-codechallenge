import axios, { AxiosInstance } from "axios";

export class ApiClient {
  private static instance: ApiClient;
  private http: AxiosInstance;

  private constructor() {
    this.http = axios.create({
      baseURL: "https://api.example.com",
    });
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }

    return ApiClient.instance;
  }

  public getHttpClient(): AxiosInstance {
    return this.http;
  }
}
