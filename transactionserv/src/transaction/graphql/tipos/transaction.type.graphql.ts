import { Field, ObjectType } from '@nestjs/graphql';
import { TransactionTypeTypeGraphql } from './transaction-type.type.graphql';
import { TransactionStatusTypeGraphql } from './transaction-status.type.graphql';
@ObjectType('Transaction')
export class TransactionTypeGraphql {
  @Field()
  id: number;
  
  @Field()
  transactionExternalId: string;

  @Field()
  value: number;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  accountExternalIdDebit?: string | null;

  @Field({ nullable: true })
  accountExternalIdCredit?: string | null;

  @Field()
  transferType: TransactionTypeTypeGraphql;

  @Field()
  transactionStatus: TransactionStatusTypeGraphql;
}
