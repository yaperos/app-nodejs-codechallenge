import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { TransactionStatus } from '../enums/transaction-status.enum';

@ObjectType()
class TransactionTypeInfo {
  @Field()
  name: string;
}

@ObjectType()
class TransactionStatusInfo {
  @Field(() => TransactionStatus)
  name: TransactionStatus;
}

@ObjectType('Transaction')
export class TransactionType {
  @Field(() => ID) // Use GraphQL ID type for external ID
  transactionExternalId: string;

  @Field()
  transactionType: TransactionTypeInfo;

  @Field()
  transactionStatus: TransactionStatusInfo;

  @Field(() => Float)
  value: number;

  @Field()
  createdAt: Date;
}