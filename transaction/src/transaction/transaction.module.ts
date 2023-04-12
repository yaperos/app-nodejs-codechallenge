import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';
import { TransactionType } from './entities/transaction-type.entity';
import { TransactionStatus } from './entities/transaction-status.entity';
import { KafkaClient } from './kafka/kafka-client.service'; // Importa KafkaClient
import { Kafka } from 'kafkajs'; // Importa Kafka desde 'kafkajs'
import { TransactionResolver } from './graphql/transaction.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      TransactionType,
      TransactionStatus,
    ]),

  ],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    TransactionResolver,
    {
      provide: 'KAFKA_CLIENT',
      useClass: KafkaClient,
    },
    {
      provide: 'KAFKA_SERVICE',
      useFactory: () => {
        return new Kafka({
          clientId: 'transaction',
          brokers: ['kafka:29092'],
          connectionTimeout: 10000,
        });
      },
    },
  ],
})
export class TransactionModule {}
