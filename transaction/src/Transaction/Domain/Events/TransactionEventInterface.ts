import {Transaction} from "../Entities/Transaction";

export interface TransactionEventInterface {
    publishTransactionCreated(transaction: Transaction): Promise<void>;
    subscribeTransactionCreated(): Promise<void>;
}
