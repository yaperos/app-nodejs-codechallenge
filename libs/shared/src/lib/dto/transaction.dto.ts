export class CreateTransactionDto {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferTypeId: number;
  value: number;
}

export class UpdateTransactionStatusDto {
  transactionId: string;
  transactionStatus: 'pending' | 'approved' | 'rejected';
}
