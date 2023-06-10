import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialTransactionEntity } from '../shared/infrastructure/financial-transaction.entity';
import { MongoFinancialTransactionsRepository } from '../shared/infrastructure/mongo-financial-transactions.repository';
import { CreateFinancialTransactionService } from './create-financial-transaction/application/create-financial-transaction.service';
import { CreateFinancialTransactionController } from './create-financial-transaction/infrastructure/create-financial-transaction.controller';
import { GetOneFinancialTransactionService } from './get-one-financial-transaction/application/get-one-financial-transaction.service';
import { GetOneFinancialTransactionController } from './get-one-financial-transaction/infrastructure/get-one-financial-transaction.controller';
import { UpdateFinancialTransactionStatusService } from './update-financial-transaction-status/application/update-financial-transaction-status.service';
import { UpdateFinancialTransactionStatusController } from './update-financial-transaction-status/infrastructure/update-financial-transaction-status.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([FinancialTransactionEntity]),
    ClientsModule.registerAsync([
      {
        name: 'FINANCIAL_TRANSACTION_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'financial-transaction',
              brokers: [
                configService.get<string>('KAFKA_BROKER') || 'localhost:9092',
              ],
              consumer: {
                groupId: 'financial-transaction-server',
              },
              ssl: true,
              sasl: {
                mechanism: 'plain',
                username: configService.get<string>('KAFKA_USERNAME') || '',
                password: configService.get<string>('KAFKA_PASSWORD') || '',
              },
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [
    CreateFinancialTransactionController,
    GetOneFinancialTransactionController,
    UpdateFinancialTransactionStatusController,
  ],
  providers: [
    CreateFinancialTransactionService,
    GetOneFinancialTransactionService,
    UpdateFinancialTransactionStatusService,
    {
      provide: 'FinancialTransactionsRepository',
      useClass: MongoFinancialTransactionsRepository,
    },
  ],
})
export class FinancialTransactionsModule {}
