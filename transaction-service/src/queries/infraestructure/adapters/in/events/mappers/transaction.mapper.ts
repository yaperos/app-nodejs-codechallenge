import { Transaction } from "src/queries/domain/transaction.domain";
import { CreateTransactionCommand } from "../../../../../application/commands/impl/create-transaction.command";

export class TransactionMapper {
    public static toCommand(transaction: Transaction): CreateTransactionCommand {
        return this.mapToCommand(transaction);
    }

    private static mapToCommand(transaction: Transaction): CreateTransactionCommand {
        const command = new CreateTransactionCommand();
        command.transactionExternalId = transaction.transactionExternalId;
        command.accountExternalIdDebit = transaction.accountExternalIdDebit;
        command.accountExternalIdCredit = transaction.accountExternalIdCredit;
        command.tranferTypeId = transaction.tranferTypeId;
        command.value = transaction.value;
        command.status = transaction.status;
        command.createdAt = transaction.createdAt;
        command.action = transaction.action;
        return command;
    }
}