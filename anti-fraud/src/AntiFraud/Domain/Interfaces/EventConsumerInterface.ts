import {MessageTransactionModel} from "../Models/MessageTransactionModel";

export interface EventConsumerInterface {
    consumer(callback: (transaction: MessageTransactionModel) => Promise<void>): Promise<void>;
}
