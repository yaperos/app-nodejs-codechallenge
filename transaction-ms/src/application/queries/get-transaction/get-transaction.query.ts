import { IQuery } from "@nestjs/cqrs";

export class GetTransactionQuery implements IQuery {
    constructor(readonly transactionExternalId: string) { }
}