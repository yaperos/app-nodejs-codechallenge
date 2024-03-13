import { LogLevel } from '@nestjs/common';
import { LoggerInterface } from './logger.model';

export interface LoggerControllerInterface {
  handlerLog(log: LoggerInterface): void;
  handlerDebug(log: LoggerInterface): void;
  handlerWarn(log: LoggerInterface): void;
  handlerError(log: LoggerInterface): void;
}

export interface LoggerServiceInterface {
  audit(level: LogLevel, log: LoggerInterface): void;
  info(level: LogLevel, log: LoggerInterface): void;
}
