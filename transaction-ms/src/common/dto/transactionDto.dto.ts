
export class TransactionDto {
  id: number;
  code: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferType: string;
  type: string;
  status: string;
  value: number;
  traceId: string;
}
