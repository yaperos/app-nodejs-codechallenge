import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

@InputType()
export class FindOneTransactionMTInput {
  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ValidateIf((o) => !o.name)
  id?: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @ValidateIf((o) => !o.id)
  name?: string;
}

@InputType()
export class FindOneTransactionInput {
  @Field(() => String)
  @IsUUID()
  transactionExternalId: string;

  @Field(() => FindOneTransactionMTInput)
  @IsObject()
  @ValidateNested()
  @Type(() => FindOneTransactionMTInput)
  transactionType: FindOneTransactionMTInput;

  @Field(() => FindOneTransactionMTInput)
  @IsObject()
  @ValidateNested()
  @Type(() => FindOneTransactionMTInput)
  transactionStatus: FindOneTransactionMTInput;

  @Field(() => Float)
  @IsNumber()
  value: number;

  @Field(() => Date)
  @IsDate()
  @Type(() => Date)
  createdAt: Date;
}
