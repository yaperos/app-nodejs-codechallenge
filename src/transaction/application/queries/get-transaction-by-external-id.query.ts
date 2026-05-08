import { IQuery } from '@nestjs/cqrs';

export class GetTransactionByExternalIdQuery implements IQuery {
  constructor(public readonly transactionExternalId: string) {}
}
