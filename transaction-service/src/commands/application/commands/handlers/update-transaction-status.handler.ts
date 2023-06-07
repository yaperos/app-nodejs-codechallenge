import { ICommandHandler, CommandHandler, EventBus } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { TransactionEntityMapper } from "../../mappers/transaction-entity.mapper";
import { TransactionCreatedEvent } from "../../events/impl/transaction-created.event";
import { UpdateTransactionStatusCommand } from "../impl/update-transaction-status.command";
import { UpdateTransactionStatusUseCase } from "../../update-transaction-status.usecase";
import { UpdateTransactionStatusPort } from "src/commands/infraestructure/ports/in/update-transaction-status.port";
import { Transaction } from "src/commands/domain/transaction.domain";


@CommandHandler(UpdateTransactionStatusCommand)
export class UpdateTransactionStatusHandler implements ICommandHandler<UpdateTransactionStatusCommand> {
    constructor(
        @Inject(UpdateTransactionStatusUseCase) private readonly updateTransactionStatusPort: UpdateTransactionStatusPort,
        private readonly eventBus: EventBus
    ) { }

    async execute(command: UpdateTransactionStatusCommand) {
        let transaction = TransactionEntityMapper.commandToDomain(command);
        transaction = await this.updateTransactionStatusPort.updateTransactionStatus(transaction);;
        this.sendEvent(transaction, this.eventBus);        
        return transaction;
    }

    private async sendEvent(transaction: Transaction, eventBus: EventBus) {
        if(transaction.transactionExternalId) {
            const event = new TransactionCreatedEvent();
            event.transactionExternalId = transaction.transactionExternalId;
            event.accountExternalIdCredit = transaction.accountExternalIdCredit;
            event.accountExternalIdDebit = transaction.accountExternalIdDebit;
            event.tranferTypeId = transaction.tranferTypeId;
            event.value = transaction.value;
            event.status = transaction.status;
            event.createdAt = transaction.createdAt;
            event.action = "u";
            eventBus.publish(event);
        }
    }
}