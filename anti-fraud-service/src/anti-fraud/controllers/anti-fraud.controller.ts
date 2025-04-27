import { Controller, Logger } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { EventPattern, Payload } from "@nestjs/microservices";
import { BaseController } from "./base.controller";
import { ValidateTransactionCommand } from "../validate-transaction/validate-transaction.command";

@Controller("anti-fraud")
export class AntiFraudController extends BaseController {
  private readonly logger = new Logger(AntiFraudController.name);
  constructor(private readonly commandBus: CommandBus) {
    super();
  }

  @EventPattern("transactions.pending")
  async validateTransactions(@Payload() eventMessage) {
    try {
      this.logger.log(
        `[TRANSACTION_UUID]: ${eventMessage} [EVENT]: validate-transaction`
      );
      await this.commandBus.execute(
        new ValidateTransactionCommand(eventMessage)
      );
    } catch (e) {
      this.logger.error(
        `Error processing user creation: ${e.message}`,
        e.stack
      );
    }
  }
}
