import { Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { ApolloError } from 'apollo-server-express';

@Catch()
export class GqlExceptionFilter implements ExceptionFilter {
  catch(exception: any) {
    const error = exception.error ?? exception;

    const statusCode: number =
      error.response?.data?.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;

    const errorDetail =
      error?.response?.data?.message ??
      error?.response?.message ??
      'Something went wrong';

    return new ApolloError(errorDetail, null, {
      statusCode,
    });
  }
}
