import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsUUID,
} from 'class-validator';
export class CreateTransactionDto {
  @IsNotEmpty()
  @IsUUID()
  accountExternalIdDebit: string;

  @IsNotEmpty()
  @IsUUID()
  accountExternalIdCredit: string;

  @IsNotEmpty()
  @IsNumber()
  @IsIn([1])
  tranferTypeId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  value: number;
}
