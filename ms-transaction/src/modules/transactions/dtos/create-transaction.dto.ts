export class CreateTransactionDto {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  correlationId: string;
  transferTypeId: number;
  value: number;
}
