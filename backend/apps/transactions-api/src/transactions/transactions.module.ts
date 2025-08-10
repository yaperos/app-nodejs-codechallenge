import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { CacheRedisModule } from "@shared/cache/cache-redis";
import { PrismaModule } from "@shared/db";
import { MessagingKafkaModule } from "@shared/messaging/messaging-kafka";
import { OutboxDrainer } from "apps/transactions-api/src/transactions/outbox/outbox.drainer";
import { TransactionsResolver } from "apps/transactions-api/src/transactions/transactions.resolver";
import { TransactionsService } from "apps/transactions-api/src/transactions/transactions.service";


@Module({
  imports: [MessagingKafkaModule, PrismaModule, CacheRedisModule, ScheduleModule.forRoot()],
  providers: [TransactionsResolver, TransactionsService, OutboxDrainer],
})
export class TransactionsModule {}