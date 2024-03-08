import { Module } from '@nestjs/common';
import { HealthModule } from './application/health/health.module';
import { LoggerModule } from './application/logger/logger.module';

@Module({
  imports: [HealthModule, LoggerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
