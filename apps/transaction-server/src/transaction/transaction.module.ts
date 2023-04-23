import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
      ConfigModule.forRoot(),
      ClientsModule.register([{
        name: 'ANTI_FRAUD_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: process.env.KAFKA_BROKERS.split(','),
          },
          consumer: {
            groupId: 'anti-fraud-consumer',
          },
          producer: {
            allowAutoTopicCreation: true,
            createPartitioner: Partitioners.LegacyPartitioner,
          }
        }
      }
    ]),
    PrismaModule
  ],
  controllers: [TransactionController],
  providers: [TransactionService]
})
export class TransactionModule {}
