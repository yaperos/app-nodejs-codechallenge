import { ICommandHandler, CommandHandler } from "@nestjs/cqrs";
import { ValidateTransactionCommand } from "./validate-transaction.command";
import { KafkaEventBus } from "src/event-bus/kafka.event-bus";
import {
  TOPIC_TRANSACTIONS_REJECTED,
  TOPIC_TRANSACTIONS_ACCEPTED,
} from "src/event-bus/event-bus.constants";
import { TRANSACTION_MAX_VALUE } from "src/anti-fraud/application/anti-fraud.constants";

@CommandHandler(ValidateTransactionCommand)
export class ValidateTransactionHandler
  implements ICommandHandler<ValidateTransactionCommand>
{
  constructor(private readonly eventBus: KafkaEventBus) {}

  async execute(command: ValidateTransactionCommand) {
    const { TransactionDTO } = command;
    if (TransactionDTO.value > TRANSACTION_MAX_VALUE) {
      this.eventBus.sendEvent(TOPIC_TRANSACTIONS_REJECTED, TransactionDTO);
    } else {
      this.eventBus.sendEvent(TOPIC_TRANSACTIONS_ACCEPTED, TransactionDTO);
    }
  }
}
