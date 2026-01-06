import type { LoggerService } from '@app/observability';
import { type ArgumentsHost, Catch, type ExceptionFilter, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SentryExceptionCaptured } from '@sentry/nestjs';

@Injectable()
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly logger: LoggerService) {}

    @SentryExceptionCaptured()
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        const message = exception instanceof HttpException ? exception.getResponse() : 'Internal server error';

        const requestContext = {
            correlationId: request.headers['x-correlation-id'] || 'unknown',
            requestId: request.headers['x-request-id'] || 'unknown',
            userId: request.user?.id,
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'],
        };

        this.logger.error(
            `Unhandled exception: ${status}`,
            exception instanceof Error ? exception : new Error(String(exception)),
            requestContext,
            {
                path: request.url,
                method: request.method,
            },
        );

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: typeof message === 'object' ? (message as any).message : message,
        });
    }
}
