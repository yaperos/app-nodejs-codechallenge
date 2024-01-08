import { GraphQLFormattedError } from 'graphql';

export interface HttpExceptionResponse {
  statusCode: number;
  error: string;
}

export interface CustomHttpExceptionResponse extends HttpExceptionResponse {
  path: string;
  method: string;
  timeStamp: Date;
}

export interface CustomGraphQLFormattedError extends GraphQLFormattedError {
  extensions: {
    statusCode: number;
  };
}
