import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
import * as RESPONSE from '../../config/constants/response';
import { ResponseError } from './ResponseError/ResponseError';
import { LoggerService } from '../../config/logger/logger.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      return this.httpError(exception, host);
    }
    if (exception instanceof ResponseError) {
      return this.domainError(exception, host);
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = 500;

    if (exception instanceof Object) {
      if (exception.hasOwnProperty('message') && exception.hasOwnProperty('type')) {
        interface ErrorType {
          message: string;
          type: string;
          status: number;
        }
        const newException = exception as ErrorType;
        if (newException?.status && !isNaN(newException?.status)) {
          status = newException?.status;
        }
      }
    }

    response.status(status).json({
      message: RESPONSE.GCP_ERROR_RESPONSES.INTERNAL_SERVER_ERROR.MESSAGE,
    });
  }

  private httpError(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    this.logger.error({
      transaction: { error: exception.getResponse() },
      eventId: response.getHeader('x-txref'),
      layer: 'HttpExceptionFilter',
      function: 'catch',
    });

    const status = exception.getStatus();

    let message = exception.getResponse();

    if (typeof message !== 'string') {
      message = (message as GetResponse).message;
    }

    const customResponse = this.getCustomResponse(status);

    if (customResponse !== null) {
      response.status(200).json(customResponse);
    } else {
      response.status(status).json({
        // status,
        message,
      });
    }
  }

  private domainError(exception: ResponseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(200).json({
      status: exception.status,
      message: exception.message,
    });
  }

  private getCustomResponse(status: number) {
    const customResponses = { ...RESPONSE };
    const keys = Object.keys(customResponses);
    const lookStatus = status;
    for (const key of keys) {
      const status = customResponses[key as keyof typeof customResponses];
      if (status?.STATUS == lookStatus) {
        return {
          // status: status.STATUS,
          message: status.MESSAGE,
        };
      }
    }

    return null;
  }
}

interface GetResponse {
  message: string;
}
