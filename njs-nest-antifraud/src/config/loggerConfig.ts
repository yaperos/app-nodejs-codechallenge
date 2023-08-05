
import winston, { format, loggers, transports } from 'winston';

export class LoggerConfig {
  private readonly options: winston.LoggerOptions;
  
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const transportsList = [];

    transportsList.push(new transports.Console({ level: process.env.LOG_LEVEL })); // alert > error > warning > notice > info > debug
    transportsList.push(new transports.File({filename: 'dist/logs/error.log', level: 'error'}));
    transportsList.push(new transports.File({filename: 'dist/logs/logger.log'}));

    this.options = {
      exitOnError: false,
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf((msg) => {
          return `${msg.timestamp} [${msg.level}] - ${msg.message}`;
        }),
      ),
      transports: transportsList
    };

    loggers.add('winston-logger', this.options);
  }

  public console() {
    return this.options;
  }
  
}
