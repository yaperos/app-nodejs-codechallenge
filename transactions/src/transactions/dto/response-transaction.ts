import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { TransactionStatus } from '../entity/transaction.entity';
registerEnumType(TransactionStatus, {
  name: 'TransactionStatus',
});

@ObjectType()
export class ResponseTransactionDto {
  @Field(() => String)
  transactionExternalId: string;

  @Field(() => String)
  transactionType: string;

  @Field(() => TransactionStatus)
  transactionStatus: string;

  @Field(() => Number)
  value: number;

  @Field(() => String)
  createdAt: Date;
}
