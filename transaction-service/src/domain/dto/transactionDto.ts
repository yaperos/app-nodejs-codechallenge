import {TransactionStatus} from "./value-objects/transaction-status";
import {TransactionType} from "./value-objects/transaction-type";

export class TransactionDto {
    constructor(
        public readonly transactionExternalId: string | undefined,
        public readonly accountExternalIdDebit: string | undefined,
        public readonly accountExternalIdCredit: string | undefined,
        public readonly transactionType: TransactionType | undefined,
        public readonly transactionStatus: TransactionStatus | undefined,
        public readonly value: number | undefined,
        public readonly createdAt: Date | undefined,
    ) {
    }

}