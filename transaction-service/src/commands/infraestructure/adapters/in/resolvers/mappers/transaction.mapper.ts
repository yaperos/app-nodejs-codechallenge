import { CreateTransactionCommand } from "src/commands/application/commands/impl/create-transaction.command";
import { NewTransactionInputType } from "../inputs/new-transaction.input-type";

import { TransactionObjectType } from "../objects/transaction.object-type";
import { Transaction } from "src/commands/domain/transaction.domain";

export class TransactionMapper {
    public static toCommand(input: NewTransactionInputType): CreateTransactionCommand {
        return this.mapToCommand(input);
    }

    public static toObjectType(transaction: Transaction): TransactionObjectType {
        return this.mapToObjectType(transaction);
    }

    private static mapToCommand(input: NewTransactionInputType): CreateTransactionCommand {
        const command = new CreateTransactionCommand();
        command.accountExternalIdCredit = input.accountExternalIdCredit;
        command.accountExternalIdDebit = input.accountExternalIdDebit;
        command.tranferTypeId = input.tranferTypeId;
        command.value = input.value;
        return command;
    }

    private static mapToObjectType(transaction: Transaction) {
        const objectType = new TransactionObjectType();
        objectType.transactionExternalId = transaction.transactionExternalId;
        objectType.accountExternalIdCredit = transaction.accountExternalIdCredit;
        objectType.accountExternalIdDebit = transaction.accountExternalIdDebit;
        objectType.tranferTypeId = transaction.tranferTypeId;
        objectType.value = transaction.value;
        return objectType;
    }
}