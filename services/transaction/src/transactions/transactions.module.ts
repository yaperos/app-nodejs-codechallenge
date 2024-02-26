import { Module } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { TransactionsResolver } from "./transactions.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionEvent } from "./entities/transaction-event.entity";
import { Transaction } from "./entities/transaction.entity";
import { ProducerService } from "src/kafka/producer.service";
import { TransactionType } from "./entities/transaction-type.entity";
import { TransactionStatus } from "./entities/transaction-status.entity";
import { TransactionsController } from "./transactions.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransactionEvent,
      Transaction,
      TransactionType,
      TransactionStatus,
    ]),
  ],
  providers: [TransactionsService, TransactionsResolver, ProducerService],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}
