import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConsumerService } from "../kafka/consumer.service";
import { TransactionsService } from "./transactions.service";
import { TransactionEvent } from "./entities/transaction-event.entity";
import { TransactionStatus as EnumTransactionStatus } from "@my-org/common-tools";

@Injectable()
export class TransactionsConsumer implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly transactionsService: TransactionsService
  ) {}

  async onModuleInit() {
    await this.consumerService.consume({
      topic: { topic: "event-evaluated" },
      config: { groupId: "transaction-group" },
      onMessage: async (message) => {
        // Deserialize message to get evaluated event
        const evaluatedTransactionEvent: TransactionEvent = JSON.parse(
          message.value.toString()
        );

        // Persist event int Transaction Event Table
        // await this.transactionsService.createTransactionEvent(newTransactionEvent);

        //Get transaction from Transaction Model Table
        const transactionToUpdate = await this.transactionsService.findById(
          evaluatedTransactionEvent.transactionExternalId
        );

        //Update model according to Event transaction status
        switch (evaluatedTransactionEvent.transactionStatusId) {
          case EnumTransactionStatus.Approved:
            await this.transactionsService.updateTransaction({
              transactionExternalId: transactionToUpdate.transactionExternalId,
              transactiontStatusId: EnumTransactionStatus.Approved,
            });
            break;

          case EnumTransactionStatus.Rejected:
            await this.transactionsService.updateTransaction({
              transactionExternalId: transactionToUpdate.transactionExternalId,
              transactiontStatusId: EnumTransactionStatus.Rejected,
            });
            break;
        }
      },
    });
  }
}
