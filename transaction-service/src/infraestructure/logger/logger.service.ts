import { Injectable, Logger as LoggerNest } from '@nestjs/common';
import { ILogger, StatusType } from './logger.interface';
import * as circularJSON from 'circular-json';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggerService implements ILogger {
  private logger = new LoggerNest();
  private enviroment: string;

  constructor(private readonly configService: ConfigService) {
    this.enviroment = configService.get<string>('NODE_ENV');
  }

  log(context: string, status: StatusType, message: Record<string, any>): void {
    this.logger.log(
      `[${status}] [INFO] ${circularJSON.stringify(message)}`,
      context,
    );
  }

  error(
    context: string,
    status: StatusType,
    message: Record<string, any>,
  ): void {
    this.logger.error(
      `[${status}] [ERROR] ${circularJSON.stringify(message)}`,
      context,
    );
  }

  warn(
    context: string,
    status: StatusType,
    message: Record<string, any>,
  ): void {
    this.logger.warn(
      `[${status}] [WARN] ${circularJSON.stringify(message)}`,
      context,
    );
  }

  verbose(
    context: string,
    status: StatusType,
    message: Record<string, any>,
  ): void {
    this.logger.verbose(
      `[${status}] [DEBUG] ${circularJSON.stringify(message)}`,
      context,
    );
  }

  debug(
    context: string,
    status: StatusType,
    message: Record<string, any>,
  ): void {
    if (this.enviroment !== 'production') {
      this.logger.debug(
        `[${status}] [VERBOSE] ${circularJSON.stringify(message)}`,
        context,
      );
    }
  }
}
