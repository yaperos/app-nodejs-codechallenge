export interface LoggerPort {
  log(message: string, context?: string, correlationId?: string): void;
  error(message: string, error?: Error, context?: string, correlationId?: string): void;
  warn(message: string, context?: string, correlationId?: string): void;
  debug(message: string, context?: string, correlationId?: string): void;
  info(message: string, context?: string, correlationId?: string): void;
} 