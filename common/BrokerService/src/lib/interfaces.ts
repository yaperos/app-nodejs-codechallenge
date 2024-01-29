enum MethodEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

export type TMethod = keyof typeof MethodEnum

export interface IConfig {
  path: string
  method?: TMethod
  params?: any
  headers?: any
  body?: any
}
