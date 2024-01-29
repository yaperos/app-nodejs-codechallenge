import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import URL from 'node:url'

import { TNameServices } from '../config/interfaces'
import { IConfig } from './interfaces'
import { ConfigEnv } from '../config'

export class BaseRequest {
  private nameService: TNameServices
  private serviceURL: string
  private allowedBody: string[] = ['POST', 'PUT', ' DELETE']

  constructor(service: TNameServices) {
    this.nameService = service
    this.serviceURL = ConfigEnv[this.nameService]
  }

  async send(config: IConfig): Promise<Pick<AxiosResponse, 'data' | 'status' | 'headers'>> {
    const { path, method = 'POST', headers, params, body } = config

    if (!path) throw new Error('[BaseRequest] Path is required')

    const url = URL.resolve(this.serviceURL, path)

    const configAxios: AxiosRequestConfig = {
      url,
      method: method.toLowerCase(),
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    }

    if (this.allowedBody.includes(method) && body) configAxios.data = body
    if (params) configAxios.params = params

    const { status, data, headers: responseHeader } = await axios(configAxios)

    return { status, data, headers: responseHeader }
  }
}
