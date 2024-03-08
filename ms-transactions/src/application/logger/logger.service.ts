import { Inject, Injectable, LogLevel } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { LoggerControllerInterface } from '../../domain/logger/logger.interface';
import { LoggerInterface } from 'src/domain/logger/logger.model';
import { msConfig } from 'src/infraestructure/config';

@Injectable()
export class LoggerService implements LoggerControllerInterface {
  constructor(
    @Inject(msConfig.nameLogger) private readonly loggerClient: ClientKafka,
  ) {}

  report(level: LogLevel, log: LoggerInterface): void {
    try {
      this.loggerClient.emit(`logger-${level}`, JSON.stringify(log));
    } catch (error) {
      console.log(error);
      this.report(level, log);
    }
  }
}
