import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from './logger.service';

@Module({
  exports: [LoggerService, LoggerService],
  providers: [LoggerService, ConfigService],
})
export class LoggerModule {}
