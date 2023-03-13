import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Partitioners } from "kafkajs";
import { KafkaModule } from "src/kafka/kafka.module";
import { Transaction } from "./entities/Transaction.entity";
import { TransactionStatus } from "./entities/TransactionStatus.entity";
import { TransactionType } from "./entities/TransactionType.entity";
import { ValidationResultConsumer } from "./events/ValidationResultConsumer";
import { TransactionsController } from "./transactions.controller";
import { TransactionsService } from "./transactions.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Transaction,
            TransactionType,
            TransactionStatus,
        ]),
        KafkaModule,
    ],
    controllers: [TransactionsController],
    providers: [
        TransactionsService, 
        ValidationResultConsumer
    ],
})
export class TransactionsModule {}
