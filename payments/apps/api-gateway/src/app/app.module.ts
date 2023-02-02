import { Module } from '@nestjs/common';
import { ControllersModule } from './infrastructure/controllers.module';
import { LoggerModule } from './infrastructure/logger/logger.module';

@Module({
  imports: [
    ControllersModule,
    LoggerModule
  ]
})
export class AppModule {}
