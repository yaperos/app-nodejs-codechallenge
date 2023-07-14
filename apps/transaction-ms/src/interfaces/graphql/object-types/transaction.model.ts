import { Field, ObjectType } from '@nestjs/graphql';
import { TransactionTypeModel } from './transaction-type.model';
import { TransactionStatusModel } from './transaction-status.model';

@ObjectType()
export class TransactionModel {
  @Field()
  transactionExternalId: string;

  @Field()
  accountExternalIdDebit: string;

  @Field()
  accountExternalIdCredit: string;

  @Field()
  value: number;

  @Field(() => TransactionStatusModel)
  transactionStatus: TransactionStatusModel;

  @Field(() => TransactionTypeModel)
  transactionType: TransactionTypeModel;

  @Field()
  createdAt: Date;
}
