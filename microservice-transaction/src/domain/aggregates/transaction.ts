import { AggregateRoot } from "@nestjs/cqrs/dist";
import { TRANSACTION_STATUS_PENDING } from "../commons/constants";

interface ITransaction {
    transactionExternalId?: string;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    tranferType: number;
    status?: string;
    value: number;
}

export class Transaction  extends AggregateRoot{
    private readonly transactionExternalId: string;
    private readonly accountExternalIdDebit: string;
    private readonly accountExternalIdCredit: string;
    private readonly tranferType: number;
    private readonly status: string;
    private readonly value: number;

    private readonly createdAt: Date;
    private updatedAt: Date;

    constructor(transaction: ITransaction) {
        super();
        this.transactionExternalId = transaction.transactionExternalId;
        this.accountExternalIdDebit = transaction.accountExternalIdDebit;
        this.accountExternalIdCredit = transaction.accountExternalIdCredit;
        this.tranferType = transaction.tranferType;
        this.status = TRANSACTION_STATUS_PENDING;
        this.value = transaction.value;

        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    public getTransactionExternalId(): string {
        return this.transactionExternalId;
    }

    public getAccountExternalIdDebit(): string {
        return this.accountExternalIdDebit;
    }

    public getAccountExternalIdCredit(): string {
        return this.accountExternalIdCredit;
    }

    public getTranferType(): number {
        return this.tranferType;
    }

    public getStatus(): string {
        return this.status;
    }

    public getValue(): number {
        return this.value;
    }
 

    update(fields: Partial<ITransaction>) {
        Object.assign(this, fields);
        this.updatedAt = new Date();
    }
    
}