import { Logger, LeveledLogMethod, LogMethod, format, createLogger, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { CONFIG } from './environments';

let logger: Logger;
const ISO_8601_FORMAT_TIMESTAMP = 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]';

const createLog = (): Logger => {
  const consoleDefaultFormat = format.printf((msg) => {
    let newMessage = `${msg.timestamp} [${msg.level}] [${msg.pid}] --- [${msg.appName}]`;
    if (msg.className) {
      newMessage = `${newMessage} ${msg.className}`;
    }
    newMessage = `${newMessage} : ${msg.message}`;
    return newMessage;
  });

  const baseLoggerFormat = format.combine(
    format.splat(),
    format.colorize(),
    format.timestamp({ format: ISO_8601_FORMAT_TIMESTAMP }),
    consoleDefaultFormat
  );

  logger = createLogger({
    level: CONFIG.APP.LOG_LEVEL,
    format: baseLoggerFormat,
    defaultMeta: {
      appName: CONFIG.APP.NAME,
      pid: global.process.pid,
    },
    transports: [
      new DailyRotateFile({
        level: 'error',
        dirname: 'logs',
        filename: CONFIG.APP.NAME + '-error-%DATE%.log',
        maxFiles: '30d',
        zippedArchive: false,
      }),
      new DailyRotateFile({
        dirname: 'logs',
        filename: CONFIG.APP.NAME + '-%DATE%.log',
        maxFiles: '30d',
        zippedArchive: false,
      }),
    ],
  });
  // if (CONFIG.APP.ENVIRONMENT !== 'pro') {
  logger.add(new transports.Console());
  // }

  return logger;
};

export const configureLogApp = () => {
  createLog();
};

export class AppLogger {
  static getLogger(className: string): AppLogger {
    return logger.child({ className });
  }

  static getDefaultLogger(): AppLogger {
    return logger;
  }

  debug: LeveledLogMethod = logger.debug;
  info: LeveledLogMethod = logger.info;
  warn: LeveledLogMethod = logger.warn;
  error: LeveledLogMethod = logger.error;
  log: LogMethod = logger.log;
}
