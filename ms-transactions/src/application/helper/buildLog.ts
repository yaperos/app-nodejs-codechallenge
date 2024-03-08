import { LogLevel } from '@nestjs/common';
import { LoggerInterface } from '../../domain/logger/logger.model';
import { serverConfig } from '../../infraestructure/config';

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
