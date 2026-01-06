import {
  IsUUID,
  IsInt,
  IsPositive,
  IsNotEmpty,
} from 'class-validator';

export class CreateTransactionDto {

  @IsUUID()
  @IsNotEmpty()
  accountExternalIdDebit: string;

  @IsUUID()
  @IsNotEmpty()
  accountExternalIdCredit: string;

  @IsInt()
  @IsPositive()
  tranferTypeId: number;

  @IsPositive()
  value: number;
}