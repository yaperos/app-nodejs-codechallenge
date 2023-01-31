import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransactionModule } from './application/transaction.module';
import { DatabaseModule } from './infraestructure/database/database.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, TransactionModule],
})
export class AppModule {}
