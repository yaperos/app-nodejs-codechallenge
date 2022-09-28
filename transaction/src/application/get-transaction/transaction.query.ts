export class Transaction {
  readonly transactionExternalId: string;
  readonly transactionStatus: { name: string };
  readonly tranferType: { name: string };
  readonly value: number;
  readonly createdAt: Date;
}

export interface TransactionQuery {
  findById: (id: string) => Promise<Transaction | undefined>;
}
