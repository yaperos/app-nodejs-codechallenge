import { Injectable, LoggerService as ILoggerService } from '@nestjs/common';
import { pino } from 'pino';
import * as pack from '../../../package.json';
@Injectable()
export class LoggerService implements ILoggerService {
  private pino: pino.Logger;

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires

    this.pino = pino({
      level: 'trace',
      mixin: () => ({ project: pack.name }),
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
