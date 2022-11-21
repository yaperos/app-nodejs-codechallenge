import { ApplicationError } from './ApplicationError';

export enum HttpResponseCodes {
  success = 200,
  created = 201,
  accepted = 202,
  noContent = 204,
  resetContent = 205,
  partialContent = 206,
  badRequest = 400,
  unauthorized = 401,
  paymentRequired = 402,
  forbidden = 403,
  notFound = 404,
  methodNotAllowed = 405,
  notAcceptable = 406,
  conflict = 409,
  tooMany = 409,
  requestTimeout = 408,
  unprocessableEntity = 422,
  internalServerError = 500,
  notImplemented = 501,
  badGateway = 503,
  serviceUnavailable = 503,
  gatewayTimeout = 504,
  networkAuthenticationRequired = 511,
}

export interface HttpResponseBody {
  data?: any;
}

export interface HttpResponseError {
  statusCode: HttpResponseCodes;
  name: string;
  message?: string;
  data?: any;
}

export const httpErrorMapper = (error: any) => {
  return error instanceof ApplicationError
    ? HttpResponseCodes.unprocessableEntity
    : HttpResponseCodes.internalServerError;
};

export const httpResponseErrorAdapter = (error: any) => {
  return {
    success: false,
    name: error?.name,
    data: error?.data,
    message: error?.message
  };
};
