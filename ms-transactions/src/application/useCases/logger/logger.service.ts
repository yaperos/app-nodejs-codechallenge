import { Inject, Injectable, LogLevel } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { LoggerControllerInterface } from '../../../domain/logger/logger.interface';
import { msConfig, serverConfig } from '../../../infraestructure/config';
import { LoggerInterface } from 'src/domain/logger/logger.model';

@Injectable()
export class LoggerService implements LoggerControllerInterface {
  constructor(
    @Inject(msConfig.nameLogger) private readonly loggerClient: ClientKafka,
  ) {}

  report(level: LogLevel, data: object, trxId: string): void {
    try {
      this.loggerClient.emit(
        `logger-${level}`,
        JSON.stringify(this.buildLog(level, data, trxId)),
      );
    } catch (error) {
      console.error(error);
    }
  }

  private buildLog(
    level: LogLevel,
    data: object,
    trxId: string,
  ): LoggerInterface {
    return {
      level,
      msName: serverConfig.name,
      trxId: trxId,
      data,
      createdAt: new Date(),
    };
  }
}
