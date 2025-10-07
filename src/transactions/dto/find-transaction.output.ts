import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Transaction } from '../models/transaction.model';

const TransactionType: Record<number, string> = {
  1: 'Credit',
  2: 'Debit',
};

@ObjectType()
class TransactionTypeOutput {
  @Field()
  name: string;
}

@ObjectType()
class TransactionStatusOutput {
  @Field()
  name: string;
}

@ObjectType()
export class FindTransactionOutput {
  constructor(transaction: Transaction) {
    this.transactionExternalId = transaction.id;
    this.transactionType = {
      name: TransactionType[transaction.transferTypeId] || 'Unknown',
    };
    this.transactionStatus = {
      name: transaction.status,
    };
    this.value = transaction.value;
    this.createdAt = transaction.createdAt;
  }

  @Field()
  transactionExternalId: string;

  @Field(() => TransactionTypeOutput)
  transactionType: TransactionTypeOutput;

  @Field(() => TransactionStatusOutput)
  transactionStatus: TransactionStatusOutput;

  @Field(() => Float)
  value: number;

  @Field()
  createdAt: Date;
}
