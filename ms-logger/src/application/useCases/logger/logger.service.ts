// apps/payments-microservice/src/app/app.service.ts

import {
  Inject,
  Injectable,
  LogLevel,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { LoggerServiceInterface } from '../../../domain/logger/logger.interface';
import { LoggerInterface } from '../../../domain/logger/logger.model';
import { msConfig } from '../../../infraestructure/config';

@Injectable()
export class LoggerService implements OnModuleInit, LoggerServiceInterface {
  constructor(
    @Inject(msConfig.nameLogger) private readonly clientKafka: ClientKafka,
  ) {}

  onModuleInit() {
    this.clientKafka.subscribeToResponseOf('logger-log');
    this.clientKafka.subscribeToResponseOf('logger-debug');
    this.clientKafka.subscribeToResponseOf('logger-warn');
    this.clientKafka.subscribeToResponseOf('logger-error');
  }

  audit(level: LogLevel, log: LoggerInterface) {
    Logger[level](log);
  }

  info(level: LogLevel, log: LoggerInterface) {
    Logger[level](log);
  }
}
