import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { TransactionStatus } from '@transactions/domain/transaction.entity';

registerEnumType(TransactionStatus, {
  name: 'TransactionStatus',
});

@ObjectType()
export class TransactionResponseDto {
  @Field(() => String)
  transactionExternalId: string;

  @Field(() => String)
  transactionType: string;

  @Field(() => TransactionStatus)
  transactionStatus: TransactionStatus;

  @Field(() => Number)
  value: number;

  @Field(() => String)
  createdAt: Date;
}
