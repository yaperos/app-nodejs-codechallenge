export class CreateTransactionDto {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  trasferTypeId: number;
  statusId: number;
  value: number;
}
