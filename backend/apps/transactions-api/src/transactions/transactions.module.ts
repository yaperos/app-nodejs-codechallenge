import { Module } from "@nestjs/common";
import { PrismaModule } from "@shared/db";
import { KafkaMessagingModule } from "@shared/messaging/messaging-kafka";
import { TransactionsResolver } from "apps/transactions-api/src/transactions/transactions.resolver";
import { TransactionsService } from "apps/transactions-api/src/transactions/transactions.service";

@Module({
  imports: [KafkaMessagingModule, PrismaModule],
  providers: [TransactionsResolver, TransactionsService],
})
export class TransactionsModule {}