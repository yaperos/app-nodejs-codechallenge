import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ExceptionsModule } from './infrastructure/exceptions/exceptions.module';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { EnvironmentConfigModule } from './infrastructure/config/environment-config/environment-config.module';
import { AntifraudController } from './infrastructure/controllers/antifraud.controller';
import { ServicesModule } from './infrastructure/services/services.module';

@Module({
  imports: [
    
    LoggerModule,
    ExceptionsModule,
    EnvironmentConfigModule,
    ServicesModule
  ],
  controllers: [AntifraudController],
  providers: [],
})
export class AppModule {}
