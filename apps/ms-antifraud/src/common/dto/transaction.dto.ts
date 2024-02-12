import { ObjectType, Field } from '@nestjs/graphql';
import { TransactionType } from '../entities/transaction-type.entity';
import { TransactionStatus } from '../entities/transaction-status.entity';

@ObjectType()
export class TransactionDto {
  @Field()
  transactionExternalId: string;

  @Field()
  accountExternalIdDebit: string;

  @Field()
  accountExternalIdCredit: string;

  @Field(() => TransactionType)
  transactionType: TransactionType;

  @Field(() => TransactionStatus)
  transactionStatus: TransactionStatus;

  @Field()
  value: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

}
