import axios, { AxiosRequestConfig } from "axios";

// Wrapper function to Axios
async function request<T>(
  config: AxiosRequestConfig
): Promise<T> {
  return await axios(config);;
};

// Simple API (post, get)
export default {
  get: (url: string) => 
  	request({ method: 'GET', url }),

  post: (url: string, data: any) => 
  	request({ method: 'POST', url, data }),
};