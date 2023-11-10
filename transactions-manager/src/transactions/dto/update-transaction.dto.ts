import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsNotEmptyObject, IsUUID } from 'class-validator';

export enum TransactionStatusName {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}


registerEnumType(TransactionStatusName, {
  name: 'TransactionStatusName',
});

@InputType()
export class TransactionStatusUpdated {
  @IsNotEmpty()
  @IsEnum(TransactionStatusName)
  @Field(() => TransactionStatusName)
  name: TransactionStatusName;
}

@InputType()
export class UpdateTransactionDto {
  @IsNotEmpty()
  @IsUUID()
  @Field()
  readonly uuid: string;

  @Field(() => TransactionStatusUpdated)
  @IsNotEmptyObject({ nullable: false })
  transactionStatus: TransactionStatusUpdated;
}
