import type { LogContext, RequestContext } from '@app/common/types/tracing.types';
import { Injectable } from '@nestjs/common';
import type { ILogger } from '../ports/logger.port';

@Injectable()
export class ConsoleLoggerAdapter implements ILogger {
    constructor(private readonly serviceName: string) {}

    private buildLogContext(
        level: LogContext['level'],
        message: string,
        context?: Partial<RequestContext>,
        metadata?: Record<string, any>,
        error?: Error,
    ): LogContext {
        return {
            correlationId: context?.correlationId || 'unknown',
            requestId: context?.requestId || 'unknown',
            timestamp: new Date().toISOString(),
            service: this.serviceName,
            userId: context?.userId,
            ipAddress: context?.ipAddress,
            userAgent: context?.userAgent,
            level,
            message,
            metadata,
            error: error
                ? {
                      message: error.message,
                      stack: error.stack,
                      code: (error as any).code,
                  }
                : undefined,
        };
    }

    private output(logContext: LogContext): void {
        console.log(JSON.stringify(logContext));
    }

    log(message: string, context?: Partial<RequestContext>, metadata?: Record<string, any>): void {
        this.output(this.buildLogContext('info', message, context, metadata));
    }

    error(message: string, error?: Error, context?: Partial<RequestContext>, metadata?: Record<string, any>): void {
        this.output(this.buildLogContext('error', message, context, metadata, error));
    }

    warn(message: string, context?: Partial<RequestContext>, metadata?: Record<string, any>): void {
        this.output(this.buildLogContext('warn', message, context, metadata));
    }

    debug(message: string, context?: Partial<RequestContext>, metadata?: Record<string, any>): void {
        this.output(this.buildLogContext('debug', message, context, metadata));
    }

    verbose(message: string, context?: Partial<RequestContext>, metadata?: Record<string, any>): void {
        this.output(this.buildLogContext('debug', message, context, metadata));
    }
}
