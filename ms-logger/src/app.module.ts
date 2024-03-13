import { Module } from '@nestjs/common';
import { HealthModule } from './application/useCases/health/health.module';
import { LoggerModule } from './application/useCases/logger/logger.module';

@Module({
  imports: [HealthModule, LoggerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
