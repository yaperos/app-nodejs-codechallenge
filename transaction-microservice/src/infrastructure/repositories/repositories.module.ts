import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfigModule } from "../config/typeorm/typeorm.module";
import { Module } from "@nestjs/common";
import { DatabaseBankingTransactionRepository } from "./banking-transaction.repository";
import { BankingTransaction } from "../entities/banking-transaction.entity";
import { TransferType } from "../entities/transfer-type.entity";

@Module({
    imports: [TypeOrmConfigModule, TypeOrmModule.forFeature([BankingTransaction, TransferType])],
    providers: [DatabaseBankingTransactionRepository],
    exports: [DatabaseBankingTransactionRepository ],
  })
export class RepositoriesModule {}