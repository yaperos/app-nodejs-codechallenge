import { UpdateTransactionStatusCommand } from "src/commands/application/commands/impl/update-transaction-status.command";

export class TransactionMapper {
    public static toCommand(object): UpdateTransactionStatusCommand {
        return this.mapToCommand(object);
    }

    private static mapToCommand(object): UpdateTransactionStatusCommand {
        const command = new UpdateTransactionStatusCommand();
        command.transactionExternalId = object.transactionExternalId;
        command.status = object.status;
        return command;
    }
}