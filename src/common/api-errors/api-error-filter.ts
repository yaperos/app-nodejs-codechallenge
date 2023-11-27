import {
  BadRequestException,
  Catch,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { ApiError } from './api-error';

@Catch(ApiError)
export class ApiErrorFilter implements GqlExceptionFilter {
  catch(exception: ApiError | any) {
    if (exception instanceof ApiError) {
      switch (exception.status) {
        case HttpStatus.BAD_REQUEST:
          throw new BadRequestException(exception.msg);
        case HttpStatus.INTERNAL_SERVER_ERROR:
          throw new InternalServerErrorException(exception.msg);
      }
    }

    throw new InternalServerErrorException(exception.message);
  }
}
