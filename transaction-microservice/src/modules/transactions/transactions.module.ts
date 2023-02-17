import { Module } from '@nestjs/common';
import { PrismaService } from '../../core/infrastructure/services';
import { RegisterTransactionUseCase } from './application/create';
import { TransactionRepository } from './domain/repositories';
import { TransactionController } from './infrastructure/controllers/transaction-controller/transaction-controller';
import { PrismaTransactionRepository } from './infrastructure/repositories';
import { ClientsModule, Transport } from '@nestjs/microservices';

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
          producerOnlyMode: true,
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
    { provide: TransactionRepository, useClass: PrismaTransactionRepository },
  ],
})
export class TransactionsModule {}
