import { PrismaModule } from "src/prisma/prisma.module";
import { CreateTransactionHandler } from "src/transaction/create-transaction/create-transaction.handler";
import { UpdateTransactionHandler } from "src/transaction/update-transaction/update-transaction.handler";
import { GetTransactionHandler } from "src/transaction/get-transaction/get-transaction.handler";
import { TransactionController } from "./controllers/transaction.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { EventBusModule } from "src/event-bus/event-bus.module";

export const QueryHandlers = [GetTransactionHandler];

export const CommandHandlers = [
  CreateTransactionHandler,
  UpdateTransactionHandler,
];

@Module({
  imports: [PrismaModule, CqrsModule, ConfigModule, EventBusModule],
  controllers: [TransactionController],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class TransactionModule {}
