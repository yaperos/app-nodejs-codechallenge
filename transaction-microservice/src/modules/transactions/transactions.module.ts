import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaService } from '../../core/infrastructure/services';
import { RegisterTransactionUseCase } from './application/create';
import { FindOneTransactionByIdUseCase } from './application/find';
import { UpdateTransactionStatusUseCase } from './application/update';
import {
  TransactionRepository,
  TransactionTypeRepository,
} from './domain/repositories';
import { TransactionController } from './infrastructure/controllers';
import {
  PrismaTransactionRepository,
  PrismaTransactionTypeRepository,
} from './infrastructure/repositories';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TRANSACTION_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction',
            brokers: ['kafka:29092'],
          },
          consumer: {
            groupId: 'transaction-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [
    PrismaService,
    RegisterTransactionUseCase,
    UpdateTransactionStatusUseCase,
    FindOneTransactionByIdUseCase,
    { provide: TransactionRepository, useClass: PrismaTransactionRepository },
    {
      provide: TransactionTypeRepository,
      useClass: PrismaTransactionTypeRepository,
    },
  ],
})
export class TransactionsModule {}
