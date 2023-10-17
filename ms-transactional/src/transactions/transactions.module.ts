import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MongoTransaction,
  MongoTransactionSchema,
} from './infrastructure/entity/mongo-transaction';
import { MongoTransactionRepository } from './infrastructure/repository/mongo-transaction.repository';
import { CreateTransactionController } from './infrastructure/rest/create-transaction.controller';
import { ProcessRiskLevelImpl } from './application/use-case/process-risk-level-impl';
import { CreateTransactionImpl } from './application/use-case/create-transaction-impl';
import { FindTransactionImpl } from './application/use-case/find-transaction-impl';
import { FindTransactionController } from './infrastructure/rest/find-transaction.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        baseURL: config.get<string>('ACCOUNT_MANAGEMENT_API_URL'),
      }),
    }),
    MongooseModule.forFeature([
      { name: MongoTransaction.name, schema: MongoTransactionSchema },
    ]),
  ],
  controllers: [CreateTransactionController, FindTransactionController],
  providers: [
    {
      provide: 'TRANSACTION_REPOSITORY',
      useClass: MongoTransactionRepository,
    },
    {
      provide: 'PROCESS_RISK_LEVEL',
      useClass: ProcessRiskLevelImpl,
    },
    {
      provide: 'CREATE_TRANSACTION',
      useClass: CreateTransactionImpl,
    },
    {
      provide: 'FIND_TRANSACTION',
      useClass: FindTransactionImpl,
    },
  ],
})
export class TransacionsModule {}
