import { Catch, HttpException, Logger, HttpStatus } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch()
export class AllExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException) {
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      Logger.error(exception);
    }
    const message =
      status !== HttpStatus.INTERNAL_SERVER_ERROR
        ? exception.message || null
        : 'Internal server error';

    return new GraphQLError(message, {
      extensions: {
        statusCode: status,
      },
    });
  }
}
