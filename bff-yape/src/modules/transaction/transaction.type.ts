import { ObjectType, Field, ID, InputType, ArgsType } from '@nestjs/graphql';
import {
  IsDate,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsUUID,
} from 'class-validator';
import { TransactionStatus, TransactionType } from 'src/types/transaction.type';
@ObjectType()
export class Type {
  @Field()
  name: TransactionType | TransactionStatus;
}

@ObjectType()
export class TransactionStatusResolver {
  @Field(() => ID)
  @IsUUID()
  transactionExternalId: string;

  @Field(() => Type, { nullable: true })
  transactionType: Type;

  @Field(() => Type, { nullable: true })
  transactionStatus: Type;

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
  @IsIn([1])
  tranferTypeId: number;

  @Field()
  @IsNumber()
  @IsPositive()
  value: number;
}

@InputType()
export class GetTransactionArgs {
  @Field(() => ID)
  @IsNotEmpty()
  @IsUUID()
  transactionExternalId: string;
}
