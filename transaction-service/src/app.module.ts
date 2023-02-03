import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransactionModule } from './application/transaction.module';
import { DatabaseModule } from './infraestructure/database/database.module';
import { LoggerModule } from './infraestructure/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    TransactionModule,
    LoggerModule,
  ],
  providers: [LoggerModule],
})
export class AppModule {}
