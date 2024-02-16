import { ObjectType, Field } from '@nestjs/graphql';
import { Transaction } from '@prisma/client';
import { TransactionTypeModel } from './transaction-type.model';
import { TransactionStatusModel } from './transaction-status.model';

@ObjectType()
export class TransactionModel
  implements Omit<Transaction, 'transactionStatusId' | 'transactionTypeId'>
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

  @Field(() => TransactionStatusModel)
  transactionStatus: TransactionStatusModel;

  @Field(() => TransactionTypeModel)
  transactionType: TransactionTypeModel;
}
