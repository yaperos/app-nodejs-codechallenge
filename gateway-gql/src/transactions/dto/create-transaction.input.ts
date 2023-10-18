import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNumber, IsPositive, IsUUID } from 'class-validator';
import { TransactionEntity } from '../transaction.entity';

@InputType()
export class CreateTransactionInput implements Partial<TransactionEntity> {
  @Field(() => String, { description: 'Is uuid' })
  @IsUUID()
  accountExternalIdDebit: string;

  @Field(() => String, { description: 'Is uuid' })
  @IsUUID()
  accountExternalIdCredit: string;

  @Field(() => Int)
  @IsInt()
  transactionTypeId: number;

  @Field(() => Number)
  @IsNumber()
  @IsPositive()
  value: number;
}
