import { ObjectType, Field } from '@nestjs/graphql';
import { Transaction } from '.prisma/client/transaction';
import { TransactionTypeModel } from './transaction-type.model';
import { TransactionStatusModel } from './transaction-status.model';

@ObjectType('Transaction')
export class TransactionModel
  implements Omit<Transaction, 'statusId' | 'typeId'>
{
  @Field()
  transactionExternalId: string;

  @Field()
  accountExternalIdDebit: string;

  @Field()
  accountExternalIdCredit: string;

  @Field()
  value: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => TransactionTypeModel)
  transactionType: TransactionTypeModel;

  @Field(() => TransactionStatusModel)
  transactionStatus: TransactionStatusModel;
}
