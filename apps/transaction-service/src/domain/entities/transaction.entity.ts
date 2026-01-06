import { TransactionStatus } from '../value-objects/transaction-status.vo';

export class Transaction {
    constructor(
        public readonly transactionExternalId: string,
        public readonly accountExternalIdDebit: string,
        public readonly accountExternalIdCredit: string,
        public readonly transferTypeId: number,
        public readonly value: number,
        public transactionStatus: TransactionStatus,
        public readonly createdAt: Date = new Date(),
    ) {}

    approve(): void {
        this.transactionStatus = TransactionStatus.APPROVED;
    }

    reject(): void {
        this.transactionStatus = TransactionStatus.REJECTED;
    }

    isPending(): boolean {
        return this.transactionStatus === TransactionStatus.PENDING;
    }

    isApproved(): boolean {
        return this.transactionStatus === TransactionStatus.APPROVED;
    }

    isRejected(): boolean {
        return this.transactionStatus === TransactionStatus.REJECTED;
    }

    shouldBeRejected(): boolean {
        return this.value > 1000;
    }
}
