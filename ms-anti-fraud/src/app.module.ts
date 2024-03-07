import { Module } from '@nestjs/common';
import { HealthModule } from './application/health/health.module';
@Module({
  imports: [HealthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
