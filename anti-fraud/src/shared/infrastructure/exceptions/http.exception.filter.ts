import {
  Catch,
  ArgumentsHost,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { HttpException, HttpStatus } from '@nestjs/common';
@Catch() // Capture all exceptions
export class HttpExceptionFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest<Request>();
    const message =
      exception?.response?.message ||
      exception?.response?.error ||
      exception?.message;
    const code = 'HttpException';
    /*
    Logger.error(
      message,
      (exception as any).stack,
      `${request.method} ${request.url}`,
    );*/
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    console.log(status, exception.constructor);

    switch (exception.constructor) {
      case HttpException:
        status = (exception as HttpException).getStatus();
        break;
      case UnauthorizedException:
        status = (exception as HttpException).getStatus();
        break;
      case BadRequestException:
        status = (exception as HttpException).getStatus();
        break;
      default:
        status = exception?.statusCode || 500;
        break;
    }
    response.status(status).json({
      status: 'error',
      message,
      code,
      url: `${request.method} ${request.url}`,
    });
  }
}
