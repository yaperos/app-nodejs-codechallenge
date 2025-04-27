import { Controller, Logger } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { GrpcMethod } from "@nestjs/microservices";
import { KafkaEventBus } from "src/event-bus/kafka.event-bus";
import { CreateTransactionCommand } from "../create-transaction/create-transaction.command";
import {
  UpdateTransactionCommand,
  TransactionStatus,
} from "../update-transaction/update-transaction.command";
import { GetTransactionQuery } from "../get-transaction/get-transaction.query";
import { BaseController } from "./base.controller";
import { EventPattern, Payload } from "@nestjs/microservices";

@Controller("transaction")
export class TransactionController extends BaseController {
  private readonly logger = new Logger(TransactionController.name);
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: KafkaEventBus,
    private readonly queryBus: QueryBus
  ) {
    super();
  }

  @GrpcMethod("TransactionService", "CreateTransaction")
  async createTransaction(data: any): Promise<any> {
    const result = await this.commandBus.execute(
      new CreateTransactionCommand(data)
    );
    await this.eventBus.sendEvent("transactions.pending", {
      id: result.id,
      value: result.value,
    });
    return result;
  }

  @GrpcMethod("TransactionService", "GetTransaction")
  async GetTransaction(data: any): Promise<any> {
    const result = await this.queryBus.execute(new GetTransactionQuery(data));
    return result;
  }

  @EventPattern("transactions.accepted")
  async UpdateAcceptedTransactions(@Payload() eventMessage) {
    try {
      this.logger.log(
        `[TRANSACTION_UUID]: ${eventMessage.id} [EVENT]: rejected-transaction`
      );
      await this.commandBus.execute(
        new UpdateTransactionCommand(
          eventMessage.id,
          TransactionStatus.APPROVED
        )
      );
    } catch (e) {
      this.logger.error(
        `Error processing accepted transaction: ${e.message}`,
        e.stack
      );
    }
  }

  @EventPattern("transactions.rejected")
  async UpdateRejectedTransactions(@Payload() eventMessage) {
    try {
      this.logger.log(
        `[TRANSACTION_UUID]: ${eventMessage.id} [EVENT]: rejected-transaction`
      );
      await this.commandBus.execute(
        new UpdateTransactionCommand(
          eventMessage.id,
          TransactionStatus.REJECTED
        )
      );
    } catch (e) {
      this.logger.error(
        `Error processing rejected transaction: ${e.message}`,
        e.stack
      );
    }
  }
}
