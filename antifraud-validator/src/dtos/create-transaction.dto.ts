export class TransactionDto {
    public readonly transactionExternalId!: string;
    public readonly accountExternalIdDebit!: string;
    public readonly accountExternalIdCredit!: string;
    public readonly transferTypeId!: number;
    public readonly value!: number;
  }