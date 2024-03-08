import { LogLevel } from '@nestjs/common';
import { LoggerInterface } from './logger.model';

export interface LoggerControllerInterface {
  report(level: LogLevel, log: LoggerInterface): void;
}
