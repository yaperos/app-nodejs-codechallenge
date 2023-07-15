export class TransactionDTO {
  readonly accountExternalIdDebit: string;
  readonly accountExternalIdCredit: string;
  readonly transferTypeId: number;
  readonly value: number;
}
