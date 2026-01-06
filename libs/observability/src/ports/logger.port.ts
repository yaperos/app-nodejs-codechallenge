import type { RequestContext } from '@app/common/types/tracing.types';

export interface ILogger {
    log(message: string, context?: Partial<RequestContext>, metadata?: Record<string, any>): void;
    error(message: string, error?: Error, context?: Partial<RequestContext>, metadata?: Record<string, any>): void;
    warn(message: string, context?: Partial<RequestContext>, metadata?: Record<string, any>): void;
    debug(message: string, context?: Partial<RequestContext>, metadata?: Record<string, any>): void;
    verbose(message: string, context?: Partial<RequestContext>, metadata?: Record<string, any>): void;
}

export const LOGGER_PORT = Symbol.for('LOGGER_PORT');
