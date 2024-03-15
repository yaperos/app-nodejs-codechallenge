import { Module } from '@nestjs/common';
import { EnvironmentsModule } from './environments/environments.module';

@Module({
  imports: [EnvironmentsModule],
})
export class SharedModule {}
