import { Module } from "@nestjs/common";
import { ConsumerService } from "./consumer.service";
import { TransactionsService } from "../transactions.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Transaction } from "../entity/transaction.entity";

@Module({
    imports: [TypeOrmModule.forFeature([
        Transaction
      ]),
    ],
    providers: [
        ConsumerService,
        TransactionsService,
    ],
    exports: [
        ConsumerService
    ]
})

export class KafkaModule {}