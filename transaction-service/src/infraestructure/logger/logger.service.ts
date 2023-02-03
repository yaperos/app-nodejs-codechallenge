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
      `[INFO] ${circularJSON.stringify(message)} | ${status}`,
      context,
    );
  }

  error(
    context: string,
    status: StatusType,
    message: Record<string, any>,
  ): void {
    this.logger.error(
      `[ERROR] ${circularJSON.stringify(message)} | ${status}`,
      context,
    );
  }

  warn(
    context: string,
    status: StatusType,
    message: Record<string, any>,
  ): void {
    this.logger.warn(
      `[WARN] ${circularJSON.stringify(message)} | ${status}`,
      context,
    );
  }

  verbose(
    context: string,
    status: StatusType,
    message: Record<string, any>,
  ): void {
    this.logger.verbose(
      `[DEBUG] ${circularJSON.stringify(message)} | ${status}`,
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
        `[VERBOSE] ${circularJSON.stringify(message)} | ${status}`,
        context,
      );
    }
  }
}
