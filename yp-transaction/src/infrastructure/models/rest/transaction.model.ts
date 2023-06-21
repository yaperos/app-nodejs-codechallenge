import TransactionEntity, { TransactionStatesMap, TransactionTypesMap } from "../../../domain/transaction.entity";

export class CreateTransaction {
    transactionExternalId: string;
    transactionType: {
        name: string;
    };
    transactionStatus: {
        name: string;
    };
    value: number;
    createdAt: string;

    constructor(entity: TransactionEntity){
        this.createdAt = entity.createdAt!
        this.transactionExternalId = entity.transactionExternalId!
        this.value = entity.value
        this.transactionType = {
            name: TransactionStatesMap[entity.status!],
        }
        this.transactionStatus = {
            name: TransactionTypesMap[entity.tranferTypeId],
        }
    }
}

export interface FindTransactionById {
    transactionExternalId: string;
    transactionType: {
        name: string;
    };
    transactionStatus: {
        name: string;
    };
    value: number;
    createdAt: string;
}