export class UpdateTransactionDto {
    constructor(
        public readonly transactionExternalId: string,
        public readonly status: number,
      ) {}
}