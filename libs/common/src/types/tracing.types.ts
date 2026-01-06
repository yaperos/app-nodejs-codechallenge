export interface RequestContext {
    correlationId: string;
    requestId: string;
    timestamp: string;
    service: string;
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
}

export interface LogContext extends RequestContext {
    level: 'debug' | 'info' | 'warn' | 'error';
    message: string;
    metadata?: Record<string, any>;
    error?: {
        message: string;
        stack?: string;
        code?: string;
    };
}

export interface EventMetadata {
    correlationId: string;
    causationId: string;
    timestamp: string;
    service: string;
    version?: string;
}
