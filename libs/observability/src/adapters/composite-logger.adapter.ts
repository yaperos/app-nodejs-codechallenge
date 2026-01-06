import type { RequestContext } from '@app/common/types/tracing.types';
import { Injectable } from '@nestjs/common';
import type { ILogger } from '../ports/logger.port';

@Injectable()
export class CompositeLoggerAdapter implements ILogger {
    constructor(private readonly loggers: ILogger[]) {}

    log(message: string, context?: Partial<RequestContext>, metadata?: Record<string, any>): void {
        this.loggers.forEach((logger) => {
            try {
                logger.log(message, context, metadata);
            } catch (error) {
                console.error(`Logger failed:`, error);
            }
        });
    }

    error(message: string, error?: Error, context?: Partial<RequestContext>, metadata?: Record<string, any>): void {
        this.loggers.forEach((logger) => {
            try {
                logger.error(message, error, context, metadata);
            } catch (err) {
                console.error(`Logger failed:`, err);
            }
        });
    }

    warn(message: string, context?: Partial<RequestContext>, metadata?: Record<string, any>): void {
        this.loggers.forEach((logger) => {
            try {
                logger.warn(message, context, metadata);
            } catch (error) {
                console.error(`Logger failed:`, error);
            }
        });
    }

    debug(message: string, context?: Partial<RequestContext>, metadata?: Record<string, any>): void {
        this.loggers.forEach((logger) => {
            try {
                logger.debug(message, context, metadata);
            } catch (error) {
                console.error(`Logger failed:`, error);
            }
        });
    }

    verbose(message: string, context?: Partial<RequestContext>, metadata?: Record<string, any>): void {
        this.loggers.forEach((logger) => {
            try {
                logger.verbose(message, context, metadata);
            } catch (error) {
                console.error(`Logger failed:`, error);
            }
        });
    }
}
