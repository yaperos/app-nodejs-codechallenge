import { Module } from "@nestjs/common";
import { PrismaModule } from "@shared/db";
import { MessagingKafkaModule } from "@shared/messaging/messaging-kafka";
import { CommandsConsumer } from "apps/transactions-command/src/commands.consumer";
import { CommandsService } from "apps/transactions-command/src/commands.service";

@Module({
  imports: [MessagingKafkaModule, PrismaModule],
  controllers: [CommandsConsumer],
  providers: [CommandsService],
})
export class CommandsModule {}