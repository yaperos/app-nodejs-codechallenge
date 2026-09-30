import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { TransactionNotFoundError } from "../../../domain/errors/domain.errors";
import { UnitOfWorkPort } from "../../../domain/ports/unit-of-work.port";
import { TransactionCachePort } from "../../ports/transaction-cache.port";
import { STATUS_UPDATES_CONSUMER, UpdateTransactionStatusCommand } from "./update-transaction-status.command";

@CommandHandler(UpdateTransactionStatusCommand)
export class UpdateTransactionStatusHandler implements ICommandHandler<UpdateTransactionStatusCommand, void> {
    constructor(
        private readonly unitOfWork: UnitOfWorkPort,
        private readonly cache: TransactionCachePort
    ) { }

    async execute(command: UpdateTransactionStatusCommand): Promise<void> {
        const applied = await this.unitOfWork.run(
            async ({ transactions, processedMessages }) => {
                const isFirstTime = await processedMessages.markProcessed(
                    STATUS_UPDATES_CONSUMER,
                    command.eventId,
                );
                if (!isFirstTime) return false;

                const transaction = await transactions.findById(
                    command.transactionExternalId,
                );
                if (!transaction)
                    throw new TransactionNotFoundError(command.transactionExternalId);

                if (command.status === 'approved') transaction.approve();
                else transaction.reject();

                await transactions.update(transaction);
                return true;
            },
        );

        if (applied) {
            await this.cache.invalidate(command.transactionExternalId);
        }
    }

}