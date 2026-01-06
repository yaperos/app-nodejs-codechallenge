import type { RequestContext } from '@app/common/types/tracing.types';
import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/nestjs';
import type { ILogger } from '../ports/logger.port';

@Injectable()
export class SentryLoggerAdapter implements ILogger {
    private serviceName: string;

    constructor(serviceName: string) {
        this.serviceName = serviceName;
    }

    private captureWithContext(
        level: 'info' | 'warning' | 'error' | 'debug',
        message: string,
        context?: Partial<RequestContext>,
        metadata?: Record<string, any>,
        error?: Error,
    ): void {
        Sentry.withScope((scope: any) => {
            scope.setTag('service', this.serviceName);
            scope.setTag('correlation_id', context?.correlationId || 'unknown');
            scope.setTag('request_id', context?.requestId || 'unknown');
            scope.setLevel(level);

            if (context?.userId) {
                scope.setUser({
                    id: context.userId,
                    ip_address: context.ipAddress,
                });
            }

            scope.setContext('request', {
                correlationId: context?.correlationId,
                requestId: context?.requestId,
                ipAddress: context?.ipAddress,
                userAgent: context?.userAgent,
                timestamp: new Date().toISOString(),
            });

            if (metadata) {
                scope.setContext('metadata', metadata);
            }

            if (error) {
                scope.setContext('error_details', {
                    name: error.name,
                    message: error.message,
                    code: (error as any).code,
                });
                Sentry.captureException(error);
            } else {
                Sentry.captureMessage(message, level);
            }
        });
    }

    log(message: string, context?: Partial<RequestContext>, metadata?: Record<string, any>): void {
        if (process.env.NODE_ENV === 'development') {
            this.captureWithContext('info', message, context, metadata);
        }
    }

    error(message: string, error?: Error, context?: Partial<RequestContext>, metadata?: Record<string, any>): void {
        this.captureWithContext('error', message, context, metadata, error);
    }

    warn(message: string, context?: Partial<RequestContext>, metadata?: Record<string, any>): void {
        this.captureWithContext('warning', message, context, metadata);
    }

    debug(message: string, context?: Partial<RequestContext>, metadata?: Record<string, any>): void {
        if (process.env.SENTRY_DEBUG === 'true') {
            this.captureWithContext('debug', message, context, metadata);
        }
    }

    verbose(_message: string, _context?: Partial<RequestContext>, _metadata?: Record<string, any>): void {}
}
