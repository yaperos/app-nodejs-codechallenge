import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
  } from '@nestjs/common';
  import { GqlArgumentsHost } from '@nestjs/graphql';
  import { GraphQLError } from 'graphql';
  
  @Catch(HttpException)
  export class GraphQLExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
      const gqlHost = GqlArgumentsHost.create(host);
      const response = exception.getResponse();
      const status = exception.getStatus();
  
      const isObjectResponse = typeof response === 'object';
      const message = isObjectResponse
        ? (response as any).message || 'An error occurred'
        : response;
  
      return new GraphQLError(
        message,
        {
          extensions: {
            code: status,
            statusCode: status,
            message,
            ...(isObjectResponse ? response : {}),
          },
        },
      );
    }
  }
  