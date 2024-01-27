import winston, { createLogger, transports, format } from 'winston';

export default class Logger {
  private logger: winston.Logger;

  constructor() {
    this.logger = createLogger({
      level: 'info',
      format: format.simple(),
      transports: [new transports.Console()],
    });
  }

  public info(message: string): void {
    this.logger.info(message);
  }

  public error(message: string): void {
    this.logger.error(message);
  }
}