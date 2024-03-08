import { LogLevel } from '@nestjs/common';

export interface LoggerInterface {
  level: LogLevel;
  msName: string;
  trxId: string;
  custom: any;
  createdAt: Date;
}
