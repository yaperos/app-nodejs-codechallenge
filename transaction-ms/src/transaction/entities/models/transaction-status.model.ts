import { Field, ObjectType } from '@nestjs/graphql';
import { TransactionStatus } from '../enums/transaction-status.enum';

@ObjectType()
export class TransactionStatusType {

  @Field(() => TransactionStatus, { nullable: false })
  name!: keyof typeof TransactionStatus;
}