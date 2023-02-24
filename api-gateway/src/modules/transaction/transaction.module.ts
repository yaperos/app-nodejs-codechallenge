import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { ClientsModule } from '@nestjs/microservices';
import { TransactionKafkaConfig } from '../../config/kafka.config';

@Module({
  imports: [ClientsModule.register([TransactionKafkaConfig()])],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
