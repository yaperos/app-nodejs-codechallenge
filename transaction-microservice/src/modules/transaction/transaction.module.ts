import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { AntifraudKafkaConfig } from '../../config/kafka.config';

import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction, TransactionType } from '../../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, TransactionType]),
    ClientsModule.register([AntifraudKafkaConfig()]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
