import { LogLevel } from '@nestjs/common';

export interface LoggerControllerInterface {
  report(level: LogLevel, data: object, trxId: string): void;
}
