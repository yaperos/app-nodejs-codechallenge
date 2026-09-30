import { randomUUID } from "node:crypto";
import { TransactionStatus } from "../enum/transaction-status.enum";
import { InvalidStatusTransitionError, InvalidTransactionError } from "../errors/domain.errors";
import { TRANSFER_TYPES } from "../value-objects/transfer-type";
import { Money } from "../value-objects/money.vo";

interface CreateTransactionInput {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    transferTypeId: number;
    value: number;
}

interface TransactionSnapshot extends CreateTransactionInput {
    id: string;
    status: TransactionStatus;
    createdAt: Date;
    updatedAt: Date;
}


export class Transaction {

    private constructor(
        readonly id: string,
        readonly accountExternalIdDebit: string,
        readonly accountExternalIdCredit: string,
        readonly transferTypeId: number,
        readonly value: Money,
        readonly createdAt: Date,
        private _status: TransactionStatus,
        private _updatedAt: Date,
    ) { }

    get status(): TransactionStatus {
        return this._status;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    static create(input: CreateTransactionInput, id: string = randomUUID()): Transaction {
        if (input.accountExternalIdDebit === input.accountExternalIdCredit) {
            throw new InvalidTransactionError('Debit and credit accounts must be different');
        }

        if (!(input.transferTypeId in TRANSFER_TYPES)) {
            throw new InvalidTransactionError(`Invalid transfer type ID: ${input.transferTypeId}`);
        }

        const now = new Date();

        return new Transaction(
            id,
            input.accountExternalIdDebit,
            input.accountExternalIdCredit,
            input.transferTypeId,
            Money.of(input.value),
            now,
            TransactionStatus.PENDING,
            now
        );
    }

    static restore(snapshot: TransactionSnapshot): Transaction {
        return new Transaction(
            snapshot.id,
            snapshot.accountExternalIdDebit,
            snapshot.accountExternalIdCredit,
            snapshot.transferTypeId,
            Money.of(snapshot.value),
            snapshot.createdAt,
            snapshot.status,
            snapshot.updatedAt
        );
    }

    approve(): void {
        this.transitionTo(TransactionStatus.APPROVED);
    }

    reject(): void {
        this.transitionTo(TransactionStatus.REJECTED);
    }

    toSnapshot(): TransactionSnapshot {
        return {
            id: this.id,
            accountExternalIdDebit: this.accountExternalIdDebit,
            accountExternalIdCredit: this.accountExternalIdCredit,
            transferTypeId: this.transferTypeId,
            value: this.value.amount,
            status: this._status,
            createdAt: this.createdAt,
            updatedAt: this._updatedAt
        }
    }

    private transitionTo(target: TransactionStatus): void {
        if (this._status === target) return;
        if (this._status !== TransactionStatus.PENDING) {
            throw new InvalidStatusTransitionError(this._status, target);
        }
        this._status = target;
        this._updatedAt = new Date();
    }

}