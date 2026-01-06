import { type CallHandler, type ExecutionContext, Injectable, type NestInterceptor } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import type { PinoLoggerService } from './pino-logger.service';

@Injectable()
export class HttpLoggerInterceptor implements NestInterceptor {
    constructor(private readonly logger: PinoLoggerService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        if (context.getType() !== 'http') {
            return next.handle();
        }

        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const { method, url, headers, body } = request;
        const startTime = Date.now();

        this.logger.log('Incoming HTTP request', {
            http: {
                method,
                url,
                userAgent: headers['user-agent'],
                contentType: headers['content-type'],
            },
            request: {
                body: this.sanitizeBody(body),
            },
        });

        return next.handle().pipe(
            tap((data) => {
                const duration = Date.now() - startTime;

                this.logger.log('HTTP request completed', {
                    http: {
                        method,
                        url,
                        statusCode: response.statusCode,
                        duration,
                    },
                    response: {
                        size: JSON.stringify(data).length,
                    },
                });
            }),
            catchError((error) => {
                const duration = Date.now() - startTime;

                this.logger.error(`HTTP request failed: ${error.message}`, error.stack, {
                    http: {
                        method,
                        url,
                        statusCode: error.status || 500,
                        duration,
                    },
                    error: {
                        name: error.name,
                        message: error.message,
                    },
                });

                throw error;
            }),
        );
    }

    private sanitizeBody(body: any): any {
        if (!body) return undefined;

        const sanitized = { ...body };
        const sensitiveFields = ['password', 'token', 'creditCard', 'ssn'];

        for (const field of sensitiveFields) {
            if (sanitized[field]) {
                sanitized[field] = '[REDACTED]';
            }
        }

        return sanitized;
    }
}
