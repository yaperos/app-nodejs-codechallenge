import { TransactionVerifyTypeEntity } from './transaction-verify-type.entity';
import { TransactionVerifyStatusEntity } from './transaction-verify-status.entity';
export declare class TransactionVerifyEntity {
    transactionExternalId: string;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    transactionType: TransactionVerifyTypeEntity;
    transactionStatus: TransactionVerifyStatusEntity;
    value: number;
    createdAt: Date;
    updatedAtStatus: Date;
}
