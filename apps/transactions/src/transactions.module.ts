import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { PrismaModule } from './prisma/prisma.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    PrismaModule,
    ClientsModule.register([
      {
        name: 'TRANSACTIONS_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transactions',
            brokers: ['kafka:29092'],
          },
        },
      },
    ]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
