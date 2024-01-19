import winston from 'winston';
import config from '@app/config';

export default class WinstonInfoLogger {
  static info(message: any): void {
    const logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.prettyPrint(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf((info) => {
          if (typeof info.message === 'object') {
            info.message = JSON.stringify(info.message, null, 2);
          }
          return info.message;
        }),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: `logs/${config.LOGGER_LEVELS.DEBUG}.log`, level: config.LOGGER_LEVELS.DEBUG }),
        new winston.transports.File({ filename: `logs/${config.LOGGER_LEVELS.ERROR}.log`, level: config.LOGGER_LEVELS.ERROR }),
        new winston.transports.File({ filename: `logs/${config.LOGGER_LEVELS.INFO}.log`, level: config.LOGGER_LEVELS.INFO }),
      ],
    });
    logger.info(message);
  }
}
