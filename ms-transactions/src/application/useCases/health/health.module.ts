import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { LoggerModule } from '../logger/logger.module';

@Module({
  controllers: [HealthController],
  providers: [HealthService],
  imports: [LoggerModule],
})
export class HealthModule {}
