import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { TransactionRepository } from "src/transactions/repositories/transaction.repository";
import { TransactionRejectedEvent } from "../transaction-rejected.event";
import { TransactionStatusEnum } from "src/utils/constants";

@EventsHandler(TransactionRejectedEvent)
export class TransactionRejectedHandler
    implements IEventHandler<TransactionRejectedEvent> {

    constructor(private repository: TransactionRepository) { }

    async handle(event: TransactionRejectedEvent) {
        await this.repository.updateTransaction({ transactionStatusId: TransactionStatusEnum.Rejected }, event.transactionExternalId);
    }
}