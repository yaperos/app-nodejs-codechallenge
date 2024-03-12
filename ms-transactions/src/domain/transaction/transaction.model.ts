import { IsNotEmpty, IsNumber, IsUUID, IsOptional } from 'class-validator';
import { InputType, Field, ObjectType } from '@nestjs/graphql';

export class TransactionInterfaceRequest {
  @IsUUID()
  @IsOptional()
  accountExternalIdDebit: string;

  @IsUUID()
  @IsOptional()
  accountExternalIdCredit: string;

  @IsNumber()
  @IsNotEmpty()
  tranferTypeId: number;

  @IsNumber()
  @IsNotEmpty()
  value: number;
}

export class TransactionInterface {
  type: number;
  status: number;
  value: number;
  createdAt?: Date;
  updatedAt?: Date;
  transactionExternalId: string;
}

@InputType()
export class TransactionTypeInput {
  @Field()
  name: string;
}

@InputType()
export class TransactionFilterInput {
  @Field()
  transactionExternalId: string;

  @Field(() => TransactionTypeInput)
  transactionType: TransactionTypeInput;

  @Field(() => TransactionTypeInput)
  transactionStatus: TransactionTypeInput;

  @Field()
  value: number;

  @Field()
  createdAt: string;
}

@ObjectType()
export class GetTransactionDto {
  @Field()
  id: string;

  @Field()
  type: number;

  @Field()
  status: number;

  @Field()
  value: number;

  @Field()
  createdAt?: Date;

  @Field()
  updatedAt?: Date;

  @Field()
  transactionExternalId: string;
}
