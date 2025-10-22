import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [MetricsService],
  controllers: [MetricsController],
  exports: [MetricsService],
})
export class MonitoringModule {}