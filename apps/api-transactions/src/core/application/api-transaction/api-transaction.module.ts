import { Module } from '@nestjs/common';
import { ApiTransactionService } from './api-transaction.service';
import { ApiTransactionController } from './api-transaction.controller';
import { ConfigModule } from '@nestjs/config';
import { AdaptersModule } from '../../../infrastructure/adapters/adapters.module';
import { KafkaClientModule } from '@app/kafka-client'
import { MongooseModule } from '@nestjs/mongoose'
import { Transaction, TransactionSchema } from '../../../infrastructure/adapters/database/entities/transaction.entity';
import { Transfertype,TransfertypeSchema } from '../../../infrastructure/adapters/database/entities/transferType.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Transaction.name,
        schema: TransactionSchema 
      }
    ]),
    MongooseModule.forFeature([
      {
        name: Transfertype.name,
        schema: TransfertypeSchema 
      }
    ]),
    KafkaClientModule,
  ],
  controllers: [
    ApiTransactionController
  ],
  providers: [
    ApiTransactionService
  ],
  exports: [
    ApiTransactionService
  ]
})
export class ApiTransactionModule { }
