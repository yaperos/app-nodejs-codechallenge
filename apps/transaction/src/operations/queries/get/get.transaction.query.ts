import {IQuery} from '@nestjs/cqrs';

export class GetTransactionQuery implements IQuery {
  readonly transactionExternalId: string;

  constructor(transactionExternalId: string) {
    this.transactionExternalId = transactionExternalId;
  }
}
