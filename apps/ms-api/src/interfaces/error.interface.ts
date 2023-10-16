export interface IGraphqlError {
  id?: string;
  message: string | string[];
  handler?: string;
  status?: number;
  code?: string | number;
  statusCode?: number;
}
