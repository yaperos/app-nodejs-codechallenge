import type { RequestContext } from '@app/common/types/tracing.types';
import { Inject, Injectable } from '@nestjs/common';
import { type ILogger, LOGGER_PORT } from './ports/logger.port';

@Injectable()
export class LoggerService implements ILogger {
    constructor(@Inject(LOGGER_PORT) private readonly logger: ILogger) {}

    log(message: string, context?: Partial<RequestContext>, metadata?: Record<string, any>): void {
        this.logger.log(message, context, metadata);
    }

    error(message: string, error?: Error, context?: Partial<RequestContext>, metadata?: Record<string, any>): void {
        this.logger.error(message, error, context, metadata);
    }

    warn(message: string, context?: Partial<RequestContext>, metadata?: Record<string, any>): void {
        this.logger.warn(message, context, metadata);
    }

    debug(message: string, context?: Partial<RequestContext>, metadata?: Record<string, any>): void {
        this.logger.debug(message, context, metadata);
    }

    verbose(message: string, context?: Partial<RequestContext>, metadata?: Record<string, any>): void {
        this.logger.verbose(message, context, metadata);
    }
}
