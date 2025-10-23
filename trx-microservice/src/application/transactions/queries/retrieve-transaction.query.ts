import { IQuery } from "@nestjs/cqrs";

export class RetrieveTransactionQuery implements IQuery {
    constructor(public readonly transactionExternalId: string) {}
}