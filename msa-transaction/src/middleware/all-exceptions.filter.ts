import { Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { BaseExceptionFilter } from '@nestjs/core';
import { ErrorResponse } from './errorResponse.model';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const error: Record<string, any> = exception.response
      ? exception.response.data ||
        exception.response.message ||
        exception.response
      : exception.message || exception;
    this.logger.error(error);

    const status = exception.response
      ? exception.response.status ||
        exception.response.statusCode ||
        exception.status ||
        HttpStatus.INTERNAL_SERVER_ERROR
      : exception.status
      ? exception.status
      : HttpStatus.INTERNAL_SERVER_ERROR;

    if (process.env.ENVIRONMENT !== 'production') {
      const errorResponse = new ErrorResponse(
        status,
        (new HttpErrorByCode[status]() as any).message,
        `for more information enter https://httpstatuses.com/${status}`,
        error,
        request.url,
      );
      return response.status(status).json(errorResponse);
    }

    return response.status(status).json();
  }
}
