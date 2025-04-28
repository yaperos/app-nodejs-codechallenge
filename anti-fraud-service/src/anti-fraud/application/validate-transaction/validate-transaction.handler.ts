import { ICommandHandler, CommandHandler } from "@nestjs/cqrs";
import { ValidateTransactionCommand } from "./validate-transaction.command";
import { KafkaEventBus } from "src/event-bus/kafka.event-bus";

@CommandHandler(ValidateTransactionCommand)
export class ValidateTransactionHandler
  implements ICommandHandler<ValidateTransactionCommand>
{
  constructor(private readonly eventBus: KafkaEventBus) {}

  async execute(command: ValidateTransactionCommand) {
    const { TransactionDTO } = command;
    if (TransactionDTO.value > 1000) {
      this.eventBus.sendEvent("transactions.rejected", {
        id: TransactionDTO.id,
        value: TransactionDTO.value,
      });
    } else {
      this.eventBus.sendEvent("transactions.accepted", {
        id: TransactionDTO.id,
        value: TransactionDTO.value,
      });
    }
  }
}
