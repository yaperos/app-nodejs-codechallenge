export class CreateTransactionInput {
  accountExternalIdDebit!: string;
  accountExternalIdCredit!: string;
  transferTypeId!: number;
  value!: number;
}
