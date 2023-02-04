export type ResultType = 'approved' | 'rejected';
export class UpdateTransactionDto {
  readonly transactionExternalId: string;
  readonly result: ResultType;
}
