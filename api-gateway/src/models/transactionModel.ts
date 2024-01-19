import { randomUUID } from 'crypto';
import { Schema, model } from 'mongoose';

export interface ITransaction {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    transactionExternalId: string;
    tranferTypeId: number;  
    value: number;
    status: string;
    createdAt?: Date;
}

const transactionSchema = new Schema<ITransaction>({
    transactionExternalId: {
        type: String,
        unique: true,
        default: () => randomUUID()
    },
    accountExternalIdDebit: {
        type: String,
        required: true
    },
    accountExternalIdCredit: {
        type: String,
        required: true
    },
    tranferTypeId: { 
        type: Number,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: "PENDING"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

export default model<ITransaction>('Transaction', transactionSchema);