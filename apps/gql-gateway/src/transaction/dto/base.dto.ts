import { Field, Int, ObjectType, ArgsType,  } from '@nestjs/graphql';
import { IsString, IsUUID, Min, Max, IsNumber, IsOptional } from 'class-validator';

@ObjectType()
class TransactionType {
  @Field()
  name: string;
}

@ObjectType()
export class TransactionStatus {
  @Field()
  name: string;
}

@ObjectType()
export class Transaction {
  @Field()
  transactionExternalId: string;

  @Field(() => Int)
  value: number;

  @Field()
  accountExternalIdDebit: string;

  @Field()
  accountExternalIdCredit: string;

  @Field()
  createdAt: Date;

  @Field(() => Int)
  transactionStatusId: number;

  @Field(() => Int)
  transactionTypeId: number;

  @Field(() => TransactionStatus)
  transactionStatus: TransactionStatus;

  @Field(() => TransactionType)
  transactionType: TransactionType;
}

@ObjectType()
export class TransactionRes {
  @Field()
  readonly transactionExternalId: string;

  @Field()
  readonly transactionType: TransactionType;

  @Field()
  readonly transactionStatus: TransactionStatus;

  @Field()
  readonly value: number;

  @Field()
  readonly createdAt: string;
}

const TRANSFER_TYPE_VALIDATION_MESSAGE = 'Transfer type must be [1, 2, 3]';

@ArgsType()
export class CreateTransactionReq {
  @IsString()
  @IsUUID()
  @IsOptional()
  @Field({
    nullable: true,
  })
  readonly accountExternalIdCredit: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  @Field({
    nullable: true,
  })
  readonly accountExternalIdDebit: string;

  @IsNumber()
  @Min(1, { message: TRANSFER_TYPE_VALIDATION_MESSAGE })
  @Max(3, { message: TRANSFER_TYPE_VALIDATION_MESSAGE })
  @Field(type => Int)
  readonly tranferTypeId: number;

  @Min(1)
  @IsNumber()
  @Field(type => Int)
  readonly value: number;
}

@ArgsType()
export class GetTransactionReq {
  @IsString()
  @IsUUID()
  @Field()
  readonly transactionExternalId: string;
}