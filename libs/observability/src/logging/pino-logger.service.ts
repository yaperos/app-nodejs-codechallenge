import { Injectable, type LoggerService as NestLoggerService } from '@nestjs/common';
import pino from 'pino';
import { getCurrentTraceContext } from '../tracing/otel';

export interface LogContext {
    [key: string]: any;
}

@Injectable()
export class PinoLoggerService implements NestLoggerService {
    private logger: pino.Logger;

    constructor(private readonly serviceName: string) {
        const isDevelopment = process.env.NODE_ENV !== 'production';

        this.logger = pino({
            name: serviceName,
            level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),

            transport: isDevelopment
                ? {
                      target: 'pino-pretty',
                      options: {
                          colorize: true,
                          translateTime: 'HH:MM:ss',
                          ignore: 'pid,hostname',
                          singleLine: false,
                      },
                  }
                : undefined,

            formatters: {
                level: (label) => {
                    return { level: label };
                },
            },

            timestamp: pino.stdTimeFunctions.isoTime,

            redact: {
                paths: ['password', 'token', 'authorization', 'cookie', 'creditCard', 'ssn'],
                remove: true,
            },
        });
    }

    private enrichWithTraceContext(context?: LogContext): LogContext {
        const traceContext = getCurrentTraceContext();

        return {
            service: this.serviceName,
            ...context,
            ...(traceContext && {
                traceId: traceContext.traceId,
                spanId: traceContext.spanId,
                traceFlags: traceContext.traceFlags,
            }),
        };
    }

    log(message: string, context?: LogContext): void {
        this.logger.info(this.enrichWithTraceContext(context), message);
    }

    error(message: string, trace?: string, context?: LogContext): void {
        this.logger.error(this.enrichWithTraceContext({ ...context, stack: trace }), message);
    }

    warn(message: string, context?: LogContext): void {
        this.logger.warn(this.enrichWithTraceContext(context), message);
    }

    debug(message: string, context?: LogContext): void {
        this.logger.debug(this.enrichWithTraceContext(context), message);
    }

    verbose(message: string, context?: LogContext): void {
        this.logger.trace(this.enrichWithTraceContext(context), message);
    }

    fatal(message: string, context?: LogContext): void {
        this.logger.fatal(this.enrichWithTraceContext(context), message);
    }

    child(bindings: LogContext): PinoLoggerService {
        const childLogger = new PinoLoggerService(this.serviceName);
        childLogger.logger = this.logger.child(bindings);
        return childLogger;
    }

    getPinoLogger(): pino.Logger {
        return this.logger;
    }
}

export function createPinoLogger(serviceName: string): PinoLoggerService {
    return new PinoLoggerService(serviceName);
}
