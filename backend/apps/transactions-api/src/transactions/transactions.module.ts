import { Module } from "@nestjs/common";
import { CacheRedisModule } from "@shared/cache/cache-redis";
import { PrismaModule } from "@shared/db";
import { KafkaMessagingModule } from "@shared/messaging/messaging-kafka";
import { TransactionConsumer } from "apps/transactions-api/src/transactions/transaction.consumer";
import { TransactionsResolver } from "apps/transactions-api/src/transactions/transactions.resolver";
import { TransactionsService } from "apps/transactions-api/src/transactions/transactions.service";


@Module({
  controllers: [TransactionConsumer],
  imports: [KafkaMessagingModule, PrismaModule, CacheRedisModule],
  providers: [TransactionsResolver, TransactionsService],
})
export class TransactionsModule {}