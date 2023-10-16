import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { IsDate, IsNumber, IsString, IsUUID } from 'class-validator';

@ObjectType()
export class TransactionType {
  @IsString()
  @Field({
    description: 'Category code to register',
  })
  name: string;
}

@ObjectType()
export class TransactionStatus {
  @IsString()
  @Field({
    description: 'Category code to register',
  })
  name: string;
}

@ObjectType()
export class TransactionResponse {
  @IsString()
  @Field({
    description: 'Category code to register',
  })
  transactionExternalId: string;

  @Field(() => TransactionType)
  transactionType: TransactionType;

  @Field(() => TransactionStatus)
  transactionStatus: TransactionStatus;

  @IsNumber()
  @Field({
    description: 'Category code to register',
  })
  value: number;

  @IsDate()
  @Field({
    description: 'Category code to register',
  })
  createdAt: string;
}

@ArgsType()
export class TransactionRequest {
  @IsString()
  @Field({
    description: 'Category code to register',
  })
  accountExternalIdDebit: string;

  @IsString()
  @Field({
    description: 'Category code to register',
  })
  accountExternalIdCredit: string;

  @IsNumber()
  @Field({
    description: 'Category code to register',
  })
  tranferTypeId: number;

  @IsNumber()
  @Field({
    description: 'Category code to register',
  })
  value: number;
}

@ArgsType()
export class SearchTransactionRequest {
  @IsUUID()
  @Field({
    description: 'Transaction external id',
  })
  transactionExternalId: string;
}
