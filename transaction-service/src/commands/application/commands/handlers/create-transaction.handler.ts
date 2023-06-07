import { ICommandHandler, CommandHandler, EventBus } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { TransactionEntityMapper } from "../../mappers/transaction-entity.mapper";
import { CreateTransactionPort } from "src/commands/infraestructure/ports/in/create-transaction.port";
import { CreateTransactionUseCase } from "../../create-transaction.usecase";
import { CreateTransactionCommand } from "../impl/create-transaction.command";
import { TransactionCreatedEvent } from "../../events/impl/transaction-created.event";
import { Transaction } from "src/commands/domain/transaction.domain";

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler implements ICommandHandler<CreateTransactionCommand> {
    constructor(
        @Inject(CreateTransactionUseCase) private readonly createTransactionPort: CreateTransactionPort,
        private readonly eventBus: EventBus,
    ) { }

    async execute(command: CreateTransactionCommand) {

        let transaction = TransactionEntityMapper.commandToDomain(command);
        transaction = await this.createTransactionPort.createTransaction(transaction);        
        
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
            event.action = "c";
            eventBus.publish(event);
        }
    }
}