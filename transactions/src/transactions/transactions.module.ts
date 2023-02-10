import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TransactionController } from './transactions.controller';
import { TransactionsResolver } from './transactions.resolver';

@Module({
  providers: [TransactionsResolver],
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction-service',
            brokers: ['kafka:29092'],
          },
          consumer: {
            groupId: 'transactions',
          },
        },
      },
    ]),
    PrismaModule,
  ],
  controllers: [TransactionController],
})
export class TransactionsModule {}
