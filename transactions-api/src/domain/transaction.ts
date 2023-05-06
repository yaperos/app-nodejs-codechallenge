import { TransactionStatus } from "src/shared/constants";

export type TransactionCreateData = {
    readonly accountExternalIdDebit: string;
    readonly accountExternalIdCredit: string;
    readonly transferTypeId: number;
    readonly value: number;
}

export type TransactionOptional = {
    readonly transactionExternalId: string;
    readonly status: number;
  };

export type TransactionProperties = Required<TransactionCreateData> &
  Partial<TransactionOptional>;

export class Transaction {
    private readonly transactionExternalId: string;
    private readonly accountExternalIdDebit: string;
    private readonly accountExternalIdCredit: string;
    //typo correction
    private readonly transferTypeId: number;
    private readonly value: number;
    private status: number;

    private readonly createdAt: Date;
    private updatedAt: Date;

    constructor(properties: TransactionProperties) {
        Object.assign(this, properties);
        this.createdAt = new Date();
        this.updatedAt = this.createdAt ;
        this.status = properties.status ? properties.status : TransactionStatus.PENDING;
      }

    getAllProperties() {
        return {
            transactionExternalId: this.transactionExternalId,
            accountExternalIdDebit: this.accountExternalIdDebit,
            accountExternalIdCredit: this.accountExternalIdCredit,
            transferTypeId: this.transferTypeId,
            value: this.value,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }

    update(fields: Partial<TransactionOptional>) {    
        Object.assign(this, fields);
        this.updatedAt = new Date();
    }
}