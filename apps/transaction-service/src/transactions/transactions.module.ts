import { KafkaInitService } from '@app/shared';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction-service',
            brokers: process.env.KAFKA_BROKERS?.split(',') || [
              'localhost:9092',
            ],
          },
          consumer: {
            groupId: 'transaction-consumer',
          },
          producer: {
            allowAutoTopicCreation: true,
          },
        },
      },
    ]),
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    PrismaService,
    KafkaInitService,
    {
      provide: KafkaInitService,
      useFactory: kafkaClient => new KafkaInitService(kafkaClient),
      inject: ['KAFKA_SERVICE'],
    },
  ],
})
export class TransactionsModule {}
