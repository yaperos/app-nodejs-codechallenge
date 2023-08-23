import { TransactionVerify } from 'src/module/domain/aggregates/transaction-verify';
export declare class SaveTransactionVerifyDto {
    static fromDomainToResponse(transactionVerifyResult: TransactionVerify): TransactionVerify;
}
