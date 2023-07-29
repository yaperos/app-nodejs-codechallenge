import { Module } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { TransactionResolver } from "./transaction.resolver";
import { TransactionController } from "./transaction.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Transaction } from "./entities/transaction";
import { TransactionStatus } from "./entities/transactionStatus";
import { TransactionType } from "./entities/transactionType";
import { KafkaModule } from "../kafka/kafka.module";
import { StatusService } from "./status.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Transaction,
            TransactionStatus,
            TransactionType
        ]),
        KafkaModule,
    ],
    providers: [TransactionService, TransactionResolver, StatusService],
    controllers: [TransactionController],
})
export class TransactionModule { }