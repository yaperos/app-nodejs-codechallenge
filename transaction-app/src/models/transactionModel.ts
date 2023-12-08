import mongoose, { Schema } from 'mongoose';

export interface ITransactionModel {
  _id: Schema.Types.ObjectId;
  transactionExternalId: string;
  transactionType: object;
  value: number;
  transactionStatus: object;
}

const schema: Schema = new Schema({
  id: { type: String, required: true },
  transactionExternalId: { type: String },
  transactionType: {
    type: Object,
  },
  value: { type: Number, required: true },
  transactionStatus: {
    type: Object,
    default: { name: 'PENDING' },
  },
  createdAt: { type: Date, default: Date.now },
});

const TransactionModel = mongoose.model<ITransactionModel>('TransactionModel', schema, 'transactions');

export default TransactionModel;
