import { LogLevel } from '@nestjs/common';
import { LoggerInterface } from 'src/domain/logger/logger.model';
import { serverConfig } from 'src/infraestructure/config';

export const buildLog = (
  level: LogLevel,
  trxId: string,
  data: any,
): LoggerInterface => {
  return {
    level,
    msName: serverConfig.name,
    trxId: trxId,
    custom: data,
    createdAt: new Date(),
  };
};
