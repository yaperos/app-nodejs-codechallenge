import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsIn, IsUUID } from 'class-validator';
import { TransactionStatus } from '../entity/transaction.entity';

@InputType()
export class UpdateTransactionDto {
  @IsUUID()
  @IsNotEmpty()
  @Field()
  id: string;

  @IsNotEmpty()
  @Field()
  @IsIn([
    TransactionStatus.PENDING,
    TransactionStatus.APPROVED,
    TransactionStatus.REJECTED,
  ])
  status: TransactionStatus;
}
