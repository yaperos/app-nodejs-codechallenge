import {Schema, model, Document} from "mongoose"
import { StatusTransaction } from "./StatusTransactions";

export interface ITransaction extends Document {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    transferTypeId: string;
    value: number;
}

export interface ITransactionReceived {
    _id: string,
    transactionExternalId: string,
    transactionType: {
        name: string
    },
    transactionStatus: {
        name: StatusTransaction
    },
    value: number,
    createdAt: Date
}

const TransactionSchema: Schema = new Schema({

    accountExternalIdDebit: {
        type: String,
        required: [true, 'accountExternalIdDebit field is required'],
        unique: true
    },
    accountExternalIdCredit: {
        type: String,
        required: [true, 'accountExternalIdCredit field is required'],
        unique: true
    },
    transferTypeId: {
        type: Schema.Types.ObjectId,
        ref: 'TransferType',
        required: [true, 'transferTypeId field is required']
    },
    value: {
        type: Number,
        required: [true, 'value field is required']
    },
    transactionStatus: {
        type: String,
        default: "PENDING"
    },
}, {
    timestamps: true,
    versionKey: false
});


export const TransactionModel = model<ITransaction>('Transaction', TransactionSchema);