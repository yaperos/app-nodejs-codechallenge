import { ObjectType, Field, ID, InputType, ArgsType } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
@ObjectType()
export class Transaction {
  @Field()
  name: string;
}

@ObjectType()
export class TransactionStatusResolver {
  @Field(() => ID)
  @IsUUID()
  transactionExternalId: string;

  @Field(() => Transaction, { nullable: true })
  transactionType: Transaction;

  @Field(() => Transaction, { nullable: true })
  transactionStatus: Transaction;

  @Field()
  @IsNumber()
  value: number;

  @Field()
  @IsDate()
  createdAt: Date;
}

@InputType()
export class TransactionCreate {
  @Field(() => ID)
  @IsUUID()
  accountExternalIdDebit: string;

  @Field(() => ID)
  @IsUUID()
  accountExternalIdCredit: string;

  @Field()
  @IsNumber()
  tranferTypeId: number;

  @Field()
  @IsNumber()
  value: number;
}

@InputType()
export class GetTransactionArgs {
  @Field(() => ID)
  @IsNotEmpty()
  @IsUUID()
  transactionExternalId: string;
}
