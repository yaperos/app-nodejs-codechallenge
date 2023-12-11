export class TransactionResponse {
  constructor(
    readonly transactionExternalId: string,
    readonly transactionType: {
      name: string;
    },
    readonly transactionStatus: {
      name: string;
    },
    readonly value: number,
    readonly createdAt: Date,
  ) {}

  static create(params: {
    transactionExternalId: string;
    transactionType: {
      name: string;
    };
    transactionStatus: {
      name: string;
    };
    value: number;
    createdAt: Date;
  }): TransactionResponse {
    return new TransactionResponse(
      params.transactionExternalId,
      params.transactionType,
      params.transactionStatus,
      params.value,
      params.createdAt,
    );
  }
}
