import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { HttpException, HttpStatus } from '@nestjs/common';
import { KafkaJSError } from 'kafkajs';
@Catch() // Capture all exceptions
export class HttpExceptionFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error en el servidor';
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    } else if (exception instanceof KafkaJSError) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Error en el servidor de Kafka';
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message || null,
    };

    response.status(status).json(errorResponse);
  }
}
