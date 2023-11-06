import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionsEntity } from '@entities/transactions.entity';
import { KafkaService } from '@shared/kafka/kafka.service';
import { API_NAME } from '@config/app';
import { KAFKA } from '@config/kafka.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionsEntity]),
    ClientsModule.register([
      {
        name: API_NAME,
        transport: Transport.KAFKA,
        options: {
          consumer: { groupId: KAFKA.groupId },
          client: {
            brokers: KAFKA.broker.split(','),
          },
        },
      },
    ]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, KafkaService],
})
export class TransactionsModule {}
