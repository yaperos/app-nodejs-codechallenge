import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';

import { IExceptionMapper } from '../interfaces/exception-mapper';
import { EXCEPTION_MAPPER } from '../constants/injection-tokens';

@Catch()
export class CoreExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(EXCEPTION_MAPPER) private readonly mapper: IExceptionMapper,
  ) {}
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const httpException = this.mapper.map(exception);
    if (exception instanceof BadRequestException) {
      response.status(exception.getStatus()).json(exception.getResponse());
    } else {
      response.status(httpException.statusCode).json(httpException);
    }
  }
}
