import { Module } from '@nestjs/common';
import { EnvironmentService } from './environment.config';

@Module({
  providers: [EnvironmentService],
  exports: [EnvironmentService],
})
export class EnvironmentModule {}
