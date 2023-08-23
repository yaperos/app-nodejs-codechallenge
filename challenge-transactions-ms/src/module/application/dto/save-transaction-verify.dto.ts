import { TransactionVerify } from 'src/module/domain/aggregates/transaction-verify';

export class SaveTransactionVerifyDto {
  static fromDomainToResponse(
    transactionVerifyResult: TransactionVerify,
  ): TransactionVerify {
    return transactionVerifyResult;
  }
}
