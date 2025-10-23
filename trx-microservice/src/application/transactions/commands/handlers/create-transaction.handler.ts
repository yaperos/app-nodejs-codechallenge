import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CreateTransactionCommand } from "../create-transaction.command";
import { Inject, Injectable } from "@nestjs/common";
import { TransactionRepository } from "../../../../domain/transactions/transaction.repository";
import { TransactionCreatedEvent } from "../../events/transaction-created.event";

@CommandHandler(CreateTransactionCommand)
@Injectable()
export class CreateTransactionHandler implements ICommandHandler<CreateTransactionCommand, string>{
    constructor(
        @Inject(TransactionRepository) private readonly trxRepo: TransactionRepository,
        private readonly eventBus: EventBus
    ) {}

    async execute(command: CreateTransactionCommand): Promise<string> {
        const trx =  await this.trxRepo.create(command)
        this.eventBus.publish(
            new TransactionCreatedEvent(
                trx.transactionExternalId,
                trx.accountExternalIdDebit,
                trx.accountExternalIdCredit,
                trx.value,
                trx.createdAt.toISOString()
            )
        )
        return trx.transactionExternalId
    }
    
}