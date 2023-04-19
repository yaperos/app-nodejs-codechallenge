import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Kafka } from 'kafkajs';
import { KafkaClient } from './kafka/kafka-client.service';

import { TransactionResolver } from './graphql/transaction.resolver';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';
import { YapeTransactionType } from './entities/transaction-type.entity';
import { TransactionStatus } from './entities/transaction-status.entity';


@Module({
  imports: [
    //  Entidades a utilizar en el módulo
    TypeOrmModule.forFeature([
      Transaction,
      YapeTransactionType,
      TransactionStatus,
    ]),

  ],
  // Declaracion de controladores, servicios y resolver de GQL usados en el módulo, y el cliente Kafka
  controllers: [TransactionController],
  providers: [
    TransactionService,
    TransactionResolver,
    {
      provide: 'KAFKA_CLIENT',
      useClass: KafkaClient,
    },
    // Instancia Kafka y su config
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
