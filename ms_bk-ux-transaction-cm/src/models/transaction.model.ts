import { TransactionStatusModel } from './transaction-status.model';
import { TransactionTypeModel } from './transaction-type.model';

export class TransactionModel {
  constructor(
    public readonly id: string,
    public readonly accountDebit: string,
    public readonly accountCredit: string,
    public readonly value: number,
    public readonly transferTypeId: number,
    public readonly statusId: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,

    public readonly transferType: TransactionTypeModel,
    public readonly status: TransactionStatusModel,
  ) {}
}
