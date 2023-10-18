import { Injectable, LoggerService as ILoggerService } from '@nestjs/common';
import { pino } from 'pino';
@Injectable()
export class LoggerService implements ILoggerService {
  private pino: pino.Logger;

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    //const pkg = require('../../../package.json');

    this.pino = pino({
      level: 'trace',
      mixin: () => ({ project: 'aewa' }),
    });
  }

  error(message: any, ...optionalParams: any[]): any {
    this.pino.error(message);
  }

  log(message: any, ...optionalParams: any[]): any {
    this.pino.info(message);
  }

  warn(message: any, ...optionalParams: any[]): any {
    this.pino.warn(message);
  }
}
