import { Module } from '@nestjs/common';
import { TransactionResolvers } from './transaction.resolvers';
import { TransactionService } from './transaction.service';
import { PrismaService } from 'src/prisma.service';
import { AppService } from 'src/app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ANTI-FRAUD',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'antiFraud',
            brokers: [process.env.KAFKA_URL],
          },
          consumer: {
            groupId: 'antiFraud-consumer',
          },
        },
      },
    ]),
  ],
  providers: [TransactionResolvers, TransactionService, PrismaService],
})
export class transactionModule {}
