import { Module } from '@nestjs/common';
import { ApiTransactionService } from './api-transaction.service';
import { ApiTransactionController } from './api-transaction.controller';
import { ConfigModule } from '@nestjs/config';
import { AdaptersModule } from '../../../infrastructure/adapters/adapters.module';
import { KafkaAdapterModule } from 'apps/api-transactions/src/infrastructure/adapters/clients/kafka/kafka-adapter.module';

@Module({
  imports: [
    AdaptersModule,
    KafkaAdapterModule
  ],
  controllers: [ApiTransactionController],
  providers: [ApiTransactionService],
  exports: [ApiTransactionService]
})
export class ApiTransactionModule { }
