import { Controller, ValidationPipe } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { LoggerInterface } from 'src/domain/logger/logger.model';
import { LoggerControllerInterface } from 'src/domain/logger/logger.interface';

@Controller()
export class LoggerController implements LoggerControllerInterface {
  constructor(private readonly loggerService: LoggerService) {}

  @EventPattern('logger-log')
  handlerLog(@Payload(ValidationPipe) data: LoggerInterface) {
    this.loggerService.audit(data.level, data);
  }

  @EventPattern('logger-debug')
  handlerDebug(@Payload(ValidationPipe) data: LoggerInterface) {
    this.loggerService.info(data.level, data);
  }

  @EventPattern('logger-warn')
  handlerWarn(@Payload(ValidationPipe) data: LoggerInterface) {
    this.loggerService.info(data.level, data);
  }

  @EventPattern('logger-error')
  handlerError(@Payload(ValidationPipe) data: LoggerInterface) {
    this.loggerService.audit(data.level, data);
  }
}
