export interface Logger {
  info(msg: string): string;
  warn(msg: string): string;
  error(msg: string): string;
  debug(msg: string): string;
}
