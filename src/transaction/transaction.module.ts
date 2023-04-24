import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionService } from "./service/transaction.service";
import { Transactions } from "./model/entity/transactions.entity";
import { TransactionRepository } from "./repository/transaction.repository";
import { UpdateConsumerService } from "./consumer/update-consumer.service";
import { Utils } from "../util/utils";
import { KafkaModule } from "@core/notificator";

@Module({
    imports:[TypeOrmModule.forFeature([Transactions]), KafkaModule],
    providers:[TransactionService, TransactionRepository, Utils, UpdateConsumerService],
    exports:[TransactionService]
})
export class TransactionModule{}