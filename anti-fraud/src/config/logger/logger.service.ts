import { Injectable, LoggerService as ILoggerService, LogLevel } from '@nestjs/common';
import fs from 'fs';
import path from 'path';
import pino from 'pino';

@Injectable()
export class LoggerService implements ILoggerService {
  private pino: pino.Logger;

  constructor() {
    const pkg = require('../../../package.json');

    this.pino = pino({
      level: 'trace',
      // prettyPrint: this.getPrettyConfig(),
      ...this.getPrettyConfig(),
      mixin() {
        return { project: pkg.name };
      },
    });
  }

  private getPrettyConfig() {
    const isDevelopment = process.env['ENVIRONMENT'] === 'development';

    if (isDevelopment) {
      return {
        transport: {
          target: 'pino-pretty',
          colorize: true,
          translateTime: true,
        },
      };
    }

    return undefined;
  }

  private getDestination() {
    const isTesting = process.env['ENVIRONMENT'] === 'testing';

    if (isTesting) {
      const dir = path.join(__dirname, '../test/logs');
      const now = new Date();
      const year = now.getFullYear();
      const month = ('0' + (now.getMonth() + 1).toString()).slice(-2);
      const day = ('0' + now.getDate().toString()).slice(-2);
      const hours = ('0' + now.getHours().toString()).slice(-2);
      const minutes = ('0' + now.getMinutes().toString()).slice(-2);
      const seconds = ('0' + now.getSeconds().toString()).slice(-2);
      const format = `${year}_${month}_${day}_${hours}${minutes}${seconds}`;
      const name = format + '.log';

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      return pino.destination({
        dest: path.join(dir, name),
        sync: false,
      });
    }

    return pino.destination({
      sync: false,
    });
  }

  log(message: any, ...optionalParams: any[]) {
    this.pino.info.apply(this.pino, arguments);
  }

  error(message: any, ...optionalParams: any[]) {
    this.pino.error.apply(this.pino, arguments);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.pino.warn.apply(this.pino, arguments);
  }

  debug(message: any, ...optionalParams: any[]) {
    this.pino.debug.apply(this.pino, arguments);
  }

  verbose(message: any, ...optionalParams: any[]) {
    this.pino.debug.apply(this.pino, arguments);
  }

  setLogLevels?(levels: LogLevel[]) {
    //
  }
}
