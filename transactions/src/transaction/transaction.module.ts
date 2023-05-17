import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [ClientsModule.register([
    {
      name: 'kafk_client_transaction',
      transport: Transport.KAFKA,
      options: {
        subscribe: {
          fromBeginning: true,
        },
        client: {
          clientId: 'transactions-validate',
          brokers: ['kafka:9092'],
        },
      },
    },
  ]), PrismaModule],
  providers: [TransactionResolver, TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}


