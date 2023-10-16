import { Module } from '@nestjs/common';
import { TransactionModule } from './modules/transaction/transaction.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'modules/logger/logger.module';

@Module({
  imports: [
    TransactionModule,
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
    }),
    LoggerModule.forRoot('Transaction Module'),
  ],
  providers: [],
})
export class TransactionServiceModule {}
