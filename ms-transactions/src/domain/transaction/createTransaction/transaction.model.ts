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
  @Field({ nullable: true })
  transactionExternalId: string;

  @Field(() => TransactionTypeInput, { nullable: true })
  transactionType: TransactionTypeInput;

  @Field(() => TransactionTypeInput, { nullable: true })
  transactionStatus: TransactionTypeInput;

  @Field({ nullable: true })
  value: number;

  @Field({ nullable: true })
  createdAt: string;
}

@ObjectType()
export class Transaction {
  @Field()
  id: string;

  @Field()
  name: string;
}

@ObjectType()
export class GetTransactionInterface {
  @Field()
  id: string;
  @Field()
  transactionExternalId: string;
  @Field()
  type: Transaction;
  @Field()
  status: Transaction;
  @Field()
  value: number;
  @Field()
  createdAt: Date;
  @Field()
  updatedAt: Date;
}
