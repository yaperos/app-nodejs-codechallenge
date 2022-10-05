import { Transaction } from "../entity/transaction.entity";
import { TransactionStatus } from "../entity/transaction_status.entity";
import { TransactionTypes } from "../entity/transaction_types.entity";

export class TransactionType {

    constructor(public readonly name) { }
}

export class TransactionState {

    constructor(public readonly name) { }
}

export class TransactionResponse {
    transactionExternalId?: string;
    transactionType?: TransactionTypes;
    transactionStatus?: TransactionStatus;
    value?: number;
    createdAt?: Date;

    constructor(transaction: Transaction) {
        var response: TransactionResponse = {};
        response.transactionExternalId = transaction.transactionExternalId;
        response.transactionType = new TransactionType(transaction.transactionType.name);
        response.transactionStatus = new TransactionState(transaction.transactionStatus.name);
        response.value = Number(transaction.value);
        response.createdAt = transaction.createdAt;
        return response;
    }
}
