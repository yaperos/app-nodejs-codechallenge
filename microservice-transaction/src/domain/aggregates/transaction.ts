import { AggregateRoot } from "@nestjs/cqrs/dist";

interface ITransaction {
    transactionExternalId?: string;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    tranferType: number;
    status?: number;
    value: number;
}

export class Transaction  extends AggregateRoot{
    private readonly transactionExternalId: string;
    private readonly accountExternalIdDebit: string;
    private readonly accountExternalIdCredit: string;
    private readonly tranferType: number;
    private readonly status: number;
    private readonly value: number;

    private readonly createdAt: Date;
    private updatedAt: Date;

    constructor(transaction: ITransaction) {
        super();
        this.transactionExternalId = transaction.transactionExternalId;
        this.accountExternalIdDebit = transaction.accountExternalIdDebit;
        this.accountExternalIdCredit = transaction.accountExternalIdCredit;
        this.tranferType = transaction.tranferType;
        this.status = transaction.status;
        this.value = transaction.value;

        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    update(fields: Partial<ITransaction>) {
        Object.assign(this, fields);
        this.updatedAt = new Date();
    }
    
}