import { LogLevel } from '@nestjs/common';

export interface LoggerInterface {
  level: LogLevel;
  msName: string;
  trxId: string;
  data: object;
  createdAt: Date;
}
