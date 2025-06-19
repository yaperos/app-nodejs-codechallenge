import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerPort } from '@domain/ports/logger.port';

interface ErrorResponse {
  mensaje: string;
  timestamp?: string;
  path?: string;
  correlationId?: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(@Inject('LoggerPort') private readonly logger: LoggerPort) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const correlationId = request.headers['x-correlation-id'] as string;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || responseObj.error || message;
        
        // Manejar errores de validación
        if (Array.isArray(responseObj.message)) {
          message = responseObj.message.join(', ');
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // Registrar el error
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception : new Error(String(exception)),
      'GlobalExceptionFilter',
      correlationId,
    );

    const errorResponse: ErrorResponse = {
      mensaje: message,
    };

    if (process.env.NODE_ENV === 'development') {
      errorResponse.timestamp = new Date().toISOString();
      errorResponse.path = request.url;
      errorResponse.correlationId = correlationId;
    }

    response.status(status).json(errorResponse);
  }
} 