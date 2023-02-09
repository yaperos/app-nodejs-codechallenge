import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

@InputType()
export class CreateTransactionInput {
  @Field({ description: 'External account debit GUID ID' })
  // @ValidateIf((o) => o.tranferTypeId === 1)
  @IsString()
  @IsNotEmpty()
  accountExternalIdDebit: string;

  @Field({ description: 'External account credit GUID ID' })
  // @ValidateIf((o) => o.tranferTypeId === 2)
  @IsString()
  @IsNotEmpty()
  accountExternalIdCredit: string;

  @Field(() => Int, { description: 'Transfer type id' })
  @IsIn([1, 2])
  tranferTypeId: number;

  @Field(() => Float, { description: 'Transfer value' })
  @IsInt()
  @Min(1)
  value: number;
}
