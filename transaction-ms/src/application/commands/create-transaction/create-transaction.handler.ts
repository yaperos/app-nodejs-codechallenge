import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateTransactionCommand } from "./create-transaction.command";
import { toTransactionView, TransactionView } from "../../dtos/transaction.view";
import { UnitOfWorkPort } from "../../../domain/ports/unit-of-work.port";
import { Transaction } from "../../../domain/entities/transaction.entity";
import { TransactionCreatedDomainEvent } from "../../../domain/events/transaction-created.event";
import { Topics, type TransactionCreatedEvent } from '@yape/contracts';
import { randomUUID } from "node:crypto";


@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler implements ICommandHandler<CreateTransactionCommand, TransactionView> {

    constructor(
        private readonly unitOfWork: UnitOfWorkPort,
    ) { }

    async execute(command: CreateTransactionCommand): Promise<TransactionView> {
        const transaction = Transaction.create({
            accountExternalIdDebit: command.accountExternalIdDebit,
            accountExternalIdCredit: command.accountExternalIdCredit,
            transferTypeId: command.transferTypeId,
            value: command.value,
        });

        const domainEvent = TransactionCreatedDomainEvent.from(transaction);

        const event: TransactionCreatedEvent = {
            eventId: randomUUID(),
            eventType: 'transaction.created',
            version: 1,
            occurredAt: domainEvent.ocurredAt.toISOString(),
            data: {
                transactionExternalId: transaction.id,
                accountExternalIdDebit: transaction.accountExternalIdDebit,
                accountExternalIdCredit: transaction.accountExternalIdCredit,
                transferTypeId: transaction.transferTypeId,
                value: transaction.value.amount
            }
        }

        await this.unitOfWork.run(async ({ transactions, outbox }) => {
            await transactions.save(transaction);
            await outbox.add({
                eventId: event.eventId,
                aggregateId: transaction.id,
                topic: Topics.TRANSACTION_CREATED,
                key: transaction.id,
                payload: event
            });
        })

        return toTransactionView(transaction);

    }
}