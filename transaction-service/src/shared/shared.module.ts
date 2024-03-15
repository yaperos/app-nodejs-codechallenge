import { Module } from '@nestjs/common';
import { DatabaseModule } from '../transaction-history/infrastructure/database/database.module';
import { EnvironmentsModule } from './environments/environments.module';

@Module({
  imports: [DatabaseModule, EnvironmentsModule],
})
export class SharedModule {}
