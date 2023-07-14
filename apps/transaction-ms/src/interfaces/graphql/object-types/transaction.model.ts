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

  @Field((type) => TransactionStatusModel)
  transactionStatus: TransactionStatusModel;

  @Field((type) => TransactionTypeModel)
  transactionType: TransactionTypeModel;

  @Field()
  createdAt: Date;
}
