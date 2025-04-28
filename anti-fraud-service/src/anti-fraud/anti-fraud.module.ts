import { ValidateTransactionHandler } from "src/anti-fraud/application/validate-transaction/validate-transaction.handler";
import { AntiFraudController } from "./infrastructure/controllers/anti-fraud.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { EventBusModule } from "src/event-bus/event-bus.module";

export const CommandHandlers = [ValidateTransactionHandler];

@Module({
  imports: [EventBusModule, CqrsModule, ConfigModule],
  controllers: [AntiFraudController],
  providers: [...CommandHandlers],
})
export class AntiFraudModule {}
