import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { ClientsModule } from '@nestjs/microservices';
import { TransactionKafkaConfig } from '@core/config/kafka';

@Module({
  imports: [ClientsModule.register([TransactionKafkaConfig()])],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
