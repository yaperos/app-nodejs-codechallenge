import { Module } from "@nestjs/common";
import { DatabaseBankingTransactionRepository } from "../repositories/banking-transaction.repository";
import { RepositoriesModule } from "../repositories/repositories.module";
import { BankingTransactionService } from "./banking-transaction.service";
import { BankingTransactionResolver } from "../resolvers/banking-transaction.resolver";
import { LoggerService } from "../logger/logger.service";

@Module({
    imports: [RepositoriesModule],
    providers: [BankingTransactionService, BankingTransactionResolver, LoggerService],
    exports: [BankingTransactionService, BankingTransactionResolver],
  })
export class ServicesModule {}