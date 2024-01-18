import { AggregateRoot } from "@nestjs/cqrs";
import { Status } from "./constants.enum";

export type Properties = {
    readonly transactionExternalId: string;
    readonly accountExternalIdDebit: string;
    readonly accountExternalIdCredit: string;
    readonly tranferTypeId: number;
    readonly value: number;
    readonly status: number;
}

export class Transaction extends AggregateRoot {
    private readonly transactionExternalId: string;
    private readonly accountExternalIdDebit: string;
    private readonly accountExternalIdCredit: string;
    private readonly transferTypeId: number;
    private readonly value: number;
    private readonly status: number;
    private readonly createdAt: Date; 
    private updatedAt: Date;

    constructor(props: Properties){
        super();
        Object.assign(this, props);
        this.status = props.transactionExternalId ? props.status : Status.Pending;
        this.createdAt = new Date();
    }
    
    data() {
        return {
            transactionExternalId: this.transactionExternalId,
            accountExternalIdDebit: this.accountExternalIdDebit,
            accountExternalIdCredit: this.accountExternalIdCredit,
            transferTypeId: this.transferTypeId,
            value: this.value,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}