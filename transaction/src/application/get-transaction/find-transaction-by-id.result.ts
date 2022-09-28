import { IQueryResult } from '@nestjs/cqrs';

export class FindTransactionByIdResult implements IQueryResult {
  readonly transactionExternalId: string;
  readonly transactionStatus: {
    name: string;
  };
  readonly tranferType: {
    name: string;
  };
  readonly value: number;
  readonly createdAt: Date = new Date();
}
