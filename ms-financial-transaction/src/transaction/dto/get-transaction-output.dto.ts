import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { TransactionTypeOutputDto } from './transaction-type-output.dto';
import { TransactionStatusOutputDto } from './transaction-status-output.dto';

@ObjectType()
export class GetTransactionOutputDto {
  @Field(() => ID)
  transactionExternalId: string;
  @Field(() => Float)
  value: number;
  @Field(() => TransactionTypeOutputDto)
  transactionType: TransactionTypeOutputDto;
  @Field(() => TransactionStatusOutputDto)
  transactionStatus: TransactionStatusOutputDto;
  @Field()
  createdAt: string;
}
