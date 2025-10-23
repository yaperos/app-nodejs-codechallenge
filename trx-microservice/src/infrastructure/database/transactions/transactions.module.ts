import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionEntity } from "./transaction.entity";
import { TransactionRepository } from "../../../domain/transactions/transaction.repository";
import { TransactionRepositoryImpl } from "./transaction.repository";


@Module({
    imports: [TypeOrmModule.forFeature([TransactionEntity])],
    providers: [
        {
            provide: TransactionRepository, useClass: TransactionRepositoryImpl
        }
    ],
    exports: [
        TransactionRepository
    ]
})
export class TransactionModule {}