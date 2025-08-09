import { Module } from "@nestjs/common";
import { TransactionsResolver } from "apps/transactions-api/src/transactions/transactions.resolver";
import { TransactionsService } from "apps/transactions-api/src/transactions/transactions.service";

@Module({
  providers: [TransactionsResolver, TransactionsService],
})
export class TransactionsModule {}