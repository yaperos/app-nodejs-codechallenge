import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import URL from "node:url";

import { TNameServices } from "../config/interfaces";
import { IConfig } from "./interfaces";
import { ConfigEnv } from "../config";

export class BaseRequest {
  private nameService: TNameServices;
  private serviceURL: string;
  private allowedBody: string[] = ["POST", "PUT", " DELETE"];

  constructor(service: TNameServices) {
    this.nameService = service;
    this.serviceURL = ConfigEnv[this.nameService];
  }

  /**
   * Sends an HTTP request to the specified service.
   *
   * @param {IConfig} config - The configuration object for the request.
   * @param {string} config.path - The URL path for the request.
   * @param {'POST'|'PUT'|'DELETE'|'GET'} [config.method='POST'] - The HTTP method to be used.
   * @param {Object} [config.headers] - Additional headers for the request.
   * @param {Object} [config.params] - URL parameters for the request.
   * @param {Object} [config.body] - The body of the request, for applicable HTTP methods.
   * @returns {Promise<Pick<AxiosResponse, 'data' | 'status' | 'headers'>>} A promise that resolves to the response from the service, including status, data, and headers.
   * @throws {Error} Throws an error if the path is not provided.
   * @async
   */
  async send(
    config: IConfig
  ): Promise<Pick<AxiosResponse, "data" | "status" | "headers">> {
    const { path, method = "POST", headers, params, body } = config;

    if (!path) throw new Error("[BaseRequest] Path is required");

    const url = URL.resolve(this.serviceURL, path);

    const configAxios: AxiosRequestConfig = {
      url,
      method: method.toLowerCase(),
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    };

    if (this.allowedBody.includes(method) && body) configAxios.data = body;
    if (params) configAxios.params = params;

    const { status, data, headers: responseHeader } = await axios(configAxios);

    return { status, data, headers: responseHeader };
  }
}
