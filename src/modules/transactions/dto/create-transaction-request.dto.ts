import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsDefined, IsNumber, IsPositive, IsUUID } from 'class-validator';

@InputType()
export class CreateTransactionRequestDTO {
  @Field({
    description:
      'UUID of the account from which the transaction amount is debited',
  })
  @IsDefined()
  @IsUUID()
  accountExternalIdDebit: string;

  @Field({
    description:
      'UUID of the account in which the transaction amount is deposited',
  })
  @IsDefined()
  @IsUUID()
  accountExternalIdCredit: string;

  @Field((_) => Int, {
    description: 'transaction type id',
  })
  @IsDefined()
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 0 })
  transferTypeId: number;

  @Field((_) => Float, {
    description: 'transaction amount',
  })
  @IsDefined()
  @IsPositive()
  @IsNumber()
  value: number;
}
