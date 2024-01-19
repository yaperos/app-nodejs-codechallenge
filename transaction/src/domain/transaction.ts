import { AggregateRoot } from "@nestjs/cqrs";
import { Status } from "./constants.enum";

export type OptionalProperties = {
    readonly transactionExternalId: string;
    readonly status: number;
};

export type RequiredProperties = {
    readonly accExternalIdDebit: string;
    readonly accExternalIdCredit: string;
    readonly transferTypeId: number;
    readonly value: number;
};

export type Properties = Required<RequiredProperties> & Partial<OptionalProperties>;

export class Transaction extends AggregateRoot {

    private readonly transactionExternalId: string;
    private readonly accExternalIdDebit: string;
    private readonly accExternalIdCredit: string;
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
            accountExternalIdDebit: this.accExternalIdDebit,
            accountExternalIdCredit: this.accExternalIdCredit,
            transferTypeId: this.transferTypeId,
            value: this.value,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    update(dataUpdate: Partial<OptionalProperties>) {
        Object.assign(this, dataUpdate);
        this.updatedAt = new Date();
    }
}