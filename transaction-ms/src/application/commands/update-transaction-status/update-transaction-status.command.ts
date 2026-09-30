import { ICommand } from "@nestjs/cqrs";
import { ValidationStatus } from "@yape/contracts";

export const STATUS_UPDATES_CONSUMER = 'transaction-service.status-updates';

export class UpdateTransactionStatusCommand implements ICommand {

    constructor(
        readonly transactionExternalId: string,
        readonly status: ValidationStatus,
        readonly eventId: string,
    ) { }

}