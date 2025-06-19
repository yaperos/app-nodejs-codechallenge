import { Injectable } from '@nestjs/common';
import { createLogger, Logger, format, transports } from 'winston';
import { LoggerPort } from '@domain/ports/logger.port';

@Injectable()
export class WinstonLoggerAdapter implements LoggerPort {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.json(),
        format.printf(({ timestamp, level, message, context, correlationId, stack }) => {
          const logObject = {
            timestamp,
            level,
            message,
            context,
            correlationId,
            ...(stack && { stack }),
          };
          return JSON.stringify(logObject);
        }),
      ),
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.simple(),
            format.printf(({ timestamp, level, message, context, correlationId }) => {
              const contextStr = context ? `[${context}]` : '';
              const correlationStr = correlationId ? `[${correlationId}]` : '';
              return `${timestamp} ${level} ${contextStr} ${correlationStr} ${message}`;
            }),
          ),
        }),
        new transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new transports.File({
          filename: 'logs/combined.log',
        }),
      ],
    });
  }

  log(message: string, context?: string, correlationId?: string): void {
    this.logger.info(message, { context, correlationId });
  }

  error(message: string, error?: Error, context?: string, correlationId?: string): void {
    this.logger.error(message, { 
      context, 
      correlationId, 
      stack: error?.stack,
      errorMessage: error?.message,
    });
  }

  warn(message: string, context?: string, correlationId?: string): void {
    this.logger.warn(message, { context, correlationId });
  }

  debug(message: string, context?: string, correlationId?: string): void {
    this.logger.debug(message, { context, correlationId });
  }

  info(message: string, context?: string, correlationId?: string): void {
    this.logger.info(message, { context, correlationId });
  }
} 