import { string } from 'joi';
import { Model, model, now, Schema, Document } from 'mongoose';

export enum TRANSACTION_STATUS {
  pending='pending',
  approved='approved',
  rejected='rejected',
}

export enum TRANSACTION_TYPE {
  debit=1,
  credit=2,
}


const transactionSchema = new Schema(
  {
    value: {
      type: Number
    },
    transactionExternalId: String,
    transactionType: {
      name: {
        type: String,
        enum: Object.values(TRANSACTION_TYPE),
      },
    },
    transactionStatus: {
      name: {
        type: String,
        enum: Object.values(TRANSACTION_STATUS),
      },
    },
    createdAt: {
      type: Date,
      default: new Date()
    }
  },
  {
    collection: 'transaction',
    timestamps: true, // INFO: Add after migration
  }
);


export interface ITransaction {
  transactionExternalId: string,
  value: number,
  transactionType: {name: string},
  transactionStatus: {name: string},
  createdAt: Date
}

type TProjectTypeDocument = ITransaction & Document;

// INFO: Add virtuals and methods
export interface ITransactionDocument extends TProjectTypeDocument {}

// INFO: Add statics
export interface ITransactionModel extends Model<ITransactionDocument> {}

export default model<ITransactionDocument, ITransactionModel>('Transaction', transactionSchema);