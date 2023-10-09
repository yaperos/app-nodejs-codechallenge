import { TransactionStatusEnum } from "../enums/transaction-status.enum";
import { TransferType } from "./transfer-type.entity";

export class Transaction {
    private id?: number;
    private accountExternalIdDebit: string;
    private accountExternalIdCredit: string;
    private transferType: TransferType;
    private value: number;
    private status?: TransactionStatusEnum;
    private createdAt?: Date;
    private updatedAt?: Date;

    /** Setters */

    public setId(id: number) {
        this.id = id;
    }

    public setAccountExternalIdDebit(accountId: string) {
        this.accountExternalIdDebit = accountId;
    }

    public setAccountExternalIdCredit(accountId: string) {
        this.accountExternalIdCredit = accountId;
    }

    public setTransferType(type: TransferType) {
        this.transferType = type;
    }

    public setValue(value: number) {
        this.value = value;
    }

    public setStatus(status: TransactionStatusEnum) {
        this.status = status;
    }

    public setCreatedAt(date: Date) {
        this.createdAt = date;
    }

    public setUpdatedAt(date: Date) {
        this.updatedAt = date;
    }

    /** Getters */

    public getId(): number | undefined {
        return this.id;
    }

    public getAccountExternalIdDebit(): string {
        return this.accountExternalIdDebit;
    }

    public getAccountExternalIdCredit(): string {
        return this.accountExternalIdCredit;
    }

    public getTransferType(): TransferType {
        return this.transferType;
    }

    public getValue(): number {
        return this.value;
    }

    public getStatus(): TransactionStatusEnum | undefined {
        return this.status;
    }

    public getCreatedAt(): Date | undefined {
        return this.createdAt;
    }

    public getUpdatedAt(): Date | undefined {
        return this.updatedAt;
    }
}