import { Module } from '@nestjs/common';

import { AppController } from './infrastructure/app.controller';
import { AppService } from './application/app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionRepository } from './domain/repositories/transaction-repository';
import { PrismaService } from './infrastructure/prisma/prisma.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ANTI_FRAUD_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'anti-fraud',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'anti_fraud',
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, TransactionRepository, PrismaService],
})
export class AppModule {}
