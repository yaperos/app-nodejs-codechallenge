export class CreateTransactionDto {
  readonly value: number;
  readonly transferTypeId: string;
  readonly accountExternalIdDebit: string;
  readonly accountExternalIdCredit: string;
}