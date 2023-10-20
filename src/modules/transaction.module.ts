import { Logger, Module } from '@nestjs/common';
import { KafkaSender } from 'core-library/src/sender/kafka.sender';
import { TransactionService } from 'transactions/src/core/transaction.service';
import { TransactionController } from '../../transactions/src/app/controller/transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'transactions/src/domain/model/transaction.model';
import { KafkaListener } from 'transactions/src/listener/validator.listener';


@Module({
  imports: [ TypeOrmModule.forFeature([Transaction])],
  controllers: [TransactionController, KafkaListener],
  providers: [TransactionService, KafkaSender, KafkaListener, Logger],
})
export class TransactionModule {}
