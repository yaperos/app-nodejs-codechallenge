export type StatusType = 'start' | 'processing' | 'end';

export interface ILogger {
  debug(
    context: string,
    status: StatusType,
    message: Record<string, any>,
  ): void;
  log(context: string, status: StatusType, message: Record<string, any>): void;
  error(
    context: string,
    status: StatusType,
    message: Record<string, any>,
  ): void;
  warn(context: string, status: StatusType, message: Record<string, any>): void;
  verbose(
    context: string,
    status: StatusType,
    message: Record<string, any>,
  ): void;
}
