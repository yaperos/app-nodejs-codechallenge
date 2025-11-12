import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { TransactionTypeDto } from './transaction-type.dto';
import { TransactionStatusDto } from './transaction-status.dto';

@ObjectType()
export class TransactionResponseDto {
  @Field(() => ID)
  transactionExternalId: string;

  @Field(() => TransactionTypeDto)
  transactionType: TransactionTypeDto;

  @Field(() => TransactionStatusDto)
  transactionStatus: TransactionStatusDto;

  @Field(() => Float)
  value: number;

  @Field()
  createdAt: Date;
}
