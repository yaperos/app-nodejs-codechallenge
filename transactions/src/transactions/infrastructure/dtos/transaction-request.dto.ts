import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID, IsEnum, IsPositive, Max } from 'class-validator';
import { TransferType } from '@transactions/domain/transaction.entity';

@InputType()
export class TransactionRequestDto {
  @Field(() => String)
  @IsNotEmpty()
  @IsUUID()
  accountExternalIdDebit: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsUUID()
  accountExternalIdCredit: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsEnum(TransferType)
  transferTypeId: TransferType;

  @Field(() => Number)
  @IsNotEmpty()
  @IsPositive()
  @Max(1000000)
  value: number;
}
