import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TransactionService } from './dto/transaction.service';
import { TransactionsResolver } from './transactions.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TRANSACTIONS_SERVICE } from 'src/config';
import { Partitioners } from 'kafkajs';

@Module({
  imports: [
    PrismaModule,
    ClientsModule.register([
      {
        name: TRANSACTIONS_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction-ms',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'transaction-consumer',
          },
          producer: {
            createPartitioner: Partitioners.LegacyPartitioner,
          },
        },
      },
    ]),
  ],
  providers: [TransactionService, TransactionsResolver],
})
export class TransactionModule {}
