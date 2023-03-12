import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import KafkaClient from "src/kafka_client/kafka_client";
import { Transaction } from "./entities/Transaction.entity";
import { TransactionStatus } from "./entities/TransactionStatus.entity";
import { TransactionType } from "./entities/TransactionType.entity";
import { TransactionsController } from "./transactions.controller";
import { TransactionsService } from "./transactions.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Transaction,
            TransactionType,
            TransactionStatus,
        ]),
    ],
    controllers: [TransactionsController],
    providers: [
        KafkaClient,
        TransactionsService
    ],
})
export class TransactionsModule {}
